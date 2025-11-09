package com.api.flux.service;

import com.api.flux.dto.request.expense.CreateExpenseRequestDTO;
import com.api.flux.dto.request.income.CreateIncomeRequestDTO;
import com.api.flux.dto.response.balance.ExpensesAndIncomesDTO;
import com.api.flux.dto.response.expense.ExpenseResponseDTO;
import com.api.flux.dto.response.gemini.PromptResponseDTO;
import com.api.flux.dto.response.income.IncomeResponseDTO;
import com.api.flux.entity.*;
import com.api.flux.enums.ExpenseCategory;
import com.api.flux.enums.IncomeCategory;
import com.api.flux.repository.LucaAIRepository;
import com.api.flux.repository.UserRepository;
import com.google.genai.Client;
import com.google.genai.types.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm")
            .withZone(ZoneId.systemDefault());

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final BalanceService balanceService;
    private final UserRepository userRepository;
    private final LucaAIRepository lucaAIRepository;
    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    public GeminiService(BalanceService balanceService, UserRepository userRepository,
                         LucaAIRepository lucaAIRepository, ExpenseService expenseService,
                         IncomeService incomeService) {
        this.balanceService = balanceService;
        this.userRepository = userRepository;
        this.lucaAIRepository = lucaAIRepository;
        this.expenseService = expenseService;
        this.incomeService = incomeService;
    }

    public ResponseEntity<PromptResponseDTO> generatePrompt(String prompt, UUID userId) {
        try {
            Client client = Client.builder()
                    .apiKey(geminiApiKey)
                    .build();

            LucAI lucAI = lucaAIRepository.findByUserId(userId)
                    .orElseGet(() -> new LucAI(userId, new ArrayList<>(), new HashMap<>()));

            String conversationContext = buildConversationContext(lucAI);
            String financialContext = buildFinancialContext(userId);
            String nameAndLastName = getUserNameAndLastName(userId);

            GenerateContentConfig config = GenerateContentConfig.builder()
                    .systemInstruction(Content.fromParts(Part.fromText(
                            "You are LucAI, a friendly and helpful financial assistant. " +
                                    "Your role is to help users manage their personal finances.\n\n" +
                                    "Today is: " + Instant.now().toString() + "\n\n"+
                                    "Conversational Style Rules:\n" +
                                    "- NEVER SAY greetings such as 'Olá', 'Oi', 'Hello', or similar unless it is clearly the first message of a new conversation.\n" +
                                    "- CONTINUE ongoing conversations naturally, without any introductory phrases or greetings.\n" +
                                    "- Maintain a warm, conversational tone without sounding repetitive.\n\n" +
                                    "Available Expense Categories: HOUSING,\n" +
                                    "    UTILITIES,\n" +
                                    "    TRANSPORTATION,\n" +
                                    "    GROCERIES,\n" +
                                    "    FOOD_AND_DINING,\n" +
                                    "    HEALTHCARE,\n" +
                                    "    WELLNESS,\n" +
                                    "    PERSONAL_CARE,\n" +
                                    "    FAMILY,\n" +
                                    "    EDUCATION,\n" +
                                    "    ENTERTAINMENT,\n" +
                                    "    LEISURE,\n" +
                                    "    FINANCIAL_OBLIGATIONS,\n" +
                                    "    SAVINGS,\n" +
                                    "    INVESTMENTS,\n" +
                                    "    DONATIONS,\n" +
                                    "    MISCELLANEOUS,\n" +
                                    "    OTHER\n" +
                                    "Available Income Categories:     SALARY,\n" +
                                    "    BONUSES,\n" +
                                    "    FREELANCE,\n" +
                                    "    COMMISSIONS,\n" +
                                    "    SALES,\n" +
                                    "    SERVICE,\n" +
                                    "    RENTAL,\n" +
                                    "    DIVIDENDS,\n" +
                                    "    INTEREST,\n" +
                                    "    CAPITAL_GAINS,\n" +
                                    "    ROYALTIES,\n" +
                                    "    PENSIONS,\n" +
                                    "    GOVERNMENT_BENEFITS,\n" +
                                    "    OTHER\n\n" +
                                    "When users want to register a transaction:\n" +
                                    "1. Identify if it's an expense or income based on context.\n" +
                                    "2. Extract or ask for: title, category, transaction date, and amount.\n" +
                                    "3. Identify if it's an expense or income based on context" +
                                    "3. ALWAYS ask the transaction date." +
                                    "4. Ask if they want to add a description (it's optional).\n" +
                                    "5. Once you have all required information, use the appropriate function.\n" +
                                    "6. Confirm the action with a friendly, conversational message.\n\n" +
                                    "Be conversational, friendly, and provide financial insights when appropriate.\n" +
                                    "Always respond in the user's language."
                    )))
                    .tools(buildTools())
                    .build();


            String fullPrompt = String.format("""
                    System: Financial assistant for %s.
                    Financial Context:
                    %s
                    
                    Conversation History:
                    %s
                    
                    New User Input:
                    %s
                    """, nameAndLastName, financialContext, conversationContext, prompt);

            List<Content> contents = List.of(Content.fromParts(Part.fromText(fullPrompt)));

            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.0-flash-exp",
                    contents,
                    config
            );

            return processResponse(response, userId, prompt, lucAI, client);

        } catch (Exception e) {
            logger.error("Error generating prompt for user {}: ", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(PromptResponseDTO.error("Error processing your request: " + e.getMessage()));
        }
    }

    private String buildConversationContext(LucAI lucAI) {
        return lucAI.getConversationHistory().stream()
                .map(entry -> "User: " + entry.getUserMessage() + "\nLucAI: " + entry.getAiResponse())
                .collect(Collectors.joining("\n\n"));
    }

    private String buildFinancialContext(UUID userId) {
        StringBuilder context = new StringBuilder();

        try {
            ResponseEntity<?> balanceResponse = balanceService.getCurrentBalance(userId);
            if (balanceResponse.getStatusCode() == HttpStatus.OK) {
                var balanceBody = balanceResponse.getBody();
                if (balanceBody != null) {
                    context.append("CURRENT BALANCE:\n");
                    context.append(formatBalanceInfo(balanceBody));
                    context.append("\n\n");
                }
            }

            ResponseEntity<ExpensesAndIncomesDTO> expensesIncomesResponse =
                    balanceService.getExpensesAndIncomeHistoryByUserId(userId);

            if (expensesIncomesResponse.getStatusCode() == HttpStatus.OK) {
                ExpensesAndIncomesDTO data = expensesIncomesResponse.getBody();
                if (data != null && data.expenses() != null && data.incomes() != null) {
                    context.append("EXPENSES:\n");
                    context.append(formatExpenses(data.expenses()));
                    context.append("\n\n");

                    context.append("INCOMES:\n");
                    context.append(formatIncomes(data.incomes()));
                }
            }

            return context.toString();

        } catch (Exception e) {
            logger.error("Error building financial context for user {}: ", userId, e);
            return "Unable to retrieve financial data at this time.";
        }
    }

    private String formatBalanceInfo(Object balanceBody) {
        return balanceBody.toString();
    }

    private String formatExpenses(List<Expense> expenses) {
        if (expenses == null || expenses.isEmpty()) {
            return "No expenses recorded.\n";
        }

        BigDecimal total = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Total expenses: $ %.2f\n", total));
        sb.append(String.format("Number of transactions: %d\n", expenses.size()));

        var byCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        sb.append("\nExpenses by category:\n");
        byCategory.forEach((category, amount) ->
                sb.append(String.format("- %s: $ %.2f\n", category, amount))
        );

        sb.append("\nRecent transactions (last 10):\n");
        expenses.stream()
                .sorted((e1, e2) -> e2.getTransactionDate().compareTo(e1.getTransactionDate()))
                .limit(10)
                .forEach(expense -> sb.append(String.format(
                        "- %s: $ %.2f [%s] on %s\n",
                        expense.getDescription(),
                        expense.getAmount(),
                        expense.getCategory(),
                        DATE_FORMATTER.format(expense.getTransactionDate())
                )));

        return sb.toString();
    }

    private String formatIncomes(List<Income> incomes) {
        if (incomes == null || incomes.isEmpty()) {
            return "No incomes recorded.\n";
        }

        BigDecimal total = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Total income: $ %.2f\n", total));
        sb.append(String.format("Number of transactions: %d\n", incomes.size()));

        var byCategory = incomes.stream()
                .collect(Collectors.groupingBy(
                        Income::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Income::getAmount, BigDecimal::add)
                ));

        sb.append("\nIncome by category:\n");
        byCategory.forEach((category, amount) ->
                sb.append(String.format("- %s: $ %.2f\n", category, amount))
        );

        sb.append("\nRecent transactions (last 10):\n");
        incomes.stream()
                .sorted((i1, i2) -> i2.getTransactionDate().compareTo(i1.getTransactionDate()))
                .limit(10)
                .forEach(income -> sb.append(String.format(
                        "- %s: $ %.2f [%s] on %s\n",
                        income.getDescription(),
                        income.getAmount(),
                        income.getCategory(),
                        DATE_FORMATTER.format(income.getTransactionDate())
                )));

        return sb.toString();
    }

    private String getUserNameAndLastName(UUID userId) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isEmpty()) {
                return "User not found";
            }

            User user = optionalUser.get();
            return user.getName() + " " + user.getLastName();
        } catch (Exception exception) {
            logger.error("Error getting user name for {}: ", userId, exception);
            return "User";
        }
    }

    private List<Tool> buildTools() {
        Tool transactionTools = Tool.builder()
                .functionDeclarations(List.of(
                        FunctionDeclaration.builder()
                                .name("create_expense")
                                .description("Creates a new expense for the user. Use this when the user wants to register a spending or cost.")
                                .parameters(Schema.builder()
                                        .type("object")
                                        .properties(Map.of(
                                                "title", Schema.builder()
                                                        .type("string")
                                                        .description("Brief title for the expense (max 50 characters)")
                                                        .build(),
                                                "description", Schema.builder()
                                                        .type("string")
                                                        .description("Optional detailed description (max 255 characters). Can be empty string if user doesn't provide one.")
                                                        .build(),
                                                "category", Schema.builder()
                                                        .type("string")
                                                        .description("Expense category. Must be one of: FOOD, TRANSPORT, HOUSING, ENTERTAINMENT, HEALTH, EDUCATION, OTHER")
                                                        .enum_(List.of("HOUSING",
                                                                "UTILITIES",
                                                                "TRANSPORTATION",
                                                                "GROCERIES",
                                                                "FOOD_AND_DINING",
                                                                "HEALTHCARE",
                                                                "WELLNESS",
                                                                "PERSONAL_CARE",
                                                                "FAMILY",
                                                                "EDUCATION",
                                                                "ENTERTAINMENT",
                                                                "LEISURE",
                                                                "FINANCIAL_OBLIGATIONS",
                                                                "SAVINGS",
                                                                "INVESTMENTS",
                                                                "DONATIONS",
                                                                "MISCELLANEOUS",
                                                                "OTHER"))
                                                        .build(),
                                                "amount", Schema.builder()
                                                        .type("number")
                                                        .description("Amount spent (must be positive)")
                                                        .build(),

                                                "transactionDate", Schema.builder()
                                                        .type("string")
                                                        .description("Date of transaction. Format ex: 2025-10-24T09:00:00Z")
                                                        .build()
                                        ))
                                        .required(List.of("title", "category", "amount"))
                                        .build())

                                .build(),
                        FunctionDeclaration.builder()
                                .name("create_income")
                                .description("Creates a new income for the user. Use this when the user wants to register money received.")
                                .parameters(Schema.builder()
                                        .type("object")
                                        .properties(Map.of(
                                                "title", Schema.builder()
                                                        .type("string")
                                                        .description("Brief title for the income (max 50 characters)")
                                                        .build(),
                                                "description", Schema.builder()
                                                        .type("string")
                                                        .description("Optional detailed description (max 255 characters). Can be empty string if user doesn't provide one.")
                                                        .build(),
                                                "category", Schema.builder()
                                                        .type("string")
                                                        .description("Income category. Must be one of: SALARY, FREELANCE, INVESTMENT, GIFT, OTHER")
                                                        .enum_(List.of("SALARY",
                                                                "BONUSES",
                                                                "FREELANCE",
                                                                "COMMISSIONS",
                                                                "SALES",
                                                                "SERVICE",
                                                                "RENTAL",
                                                                "DIVIDENDS",
                                                                "INTEREST",
                                                                "CAPITAL_GAINS",
                                                                "ROYALTIES",
                                                                "PENSIONS",
                                                                "GOVERNMENT_BENEFITS",
                                                                "OTHER"))
                                                        .build(),
                                                "amount", Schema.builder()
                                                        .type("number")
                                                        .description("Amount received (must be positive)")
                                                        .build(),
                                                "transactionDate", Schema.builder()
                                                        .type("string")
                                                        .description("Date of transaction. Format ex: 2025-10-24T09:00:00Z")
                                                        .build()
                                        ))
                                        .required(List.of("title", "category", "amount", "transactionDate"))
                                        .build())
                                .build()
                ))
                .build();

        return List.of(transactionTools);
    }

    private ResponseEntity<PromptResponseDTO> processResponse(
            GenerateContentResponse response,
            UUID userId,
            String userPrompt,
            LucAI lucAI,
            Client client) {

        StringBuilder finalResponse = new StringBuilder();
        List<Content> conversationHistory = new ArrayList<>();

        conversationHistory.add(Content.fromParts(Part.fromText(userPrompt)));

        if (response.candidates().isPresent() && !response.candidates().get().isEmpty()) {
            Candidate candidate = response.candidates().get().get(0);

            if (candidate.content().isPresent() && candidate.content().get().parts().isPresent()) {
                List<Part> parts = candidate.content().get().parts().get();

                for (Part part : parts) {
                    if (part.text().isPresent() && !part.text().get().isEmpty()) {
                        finalResponse.append(part.text().get());
                    }

                    if (part.functionCall().isPresent()) {
                        FunctionCall functionCall = part.functionCall().get();

                        if (functionCall.name().isPresent() && functionCall.args().isPresent()) {
                            String functionName = functionCall.name().get();
                            Map<String, Object> args = functionCall.args().get();

                            logger.info("Function call detected: {} with args: {}", functionName, args);

                            String functionResult = executeFunctionCall(functionName, args, userId);

                            if (candidate.content().isPresent()) {
                                conversationHistory.add(candidate.content().get());
                            }

                            conversationHistory.add(Content.fromParts(
                                    Part.fromFunctionResponse(functionName, Map.of("result", functionResult))
                            ));

                            try {
                                GenerateContentConfig followUpConfig = GenerateContentConfig.builder()
                                        .systemInstruction(Content.fromParts(Part.fromText(
                                                "You are LucAI. Generate a friendly confirmation message based on the function result."
                                        )))
                                        .build();

                                GenerateContentResponse followUpResponse = client.models.generateContent(
                                        "gemini-2.0-flash-exp",
                                        conversationHistory,
                                        followUpConfig
                                );

                                if (!followUpResponse.text().isEmpty() && !followUpResponse.text().isEmpty()) {
                                    if (finalResponse.length() > 0) {
                                        finalResponse.append("\n\n");
                                    }
                                    finalResponse.append(followUpResponse.text());
                                }
                            } catch (Exception e) {
                                logger.error("Error in follow-up call: ", e);
                                finalResponse.append("\n\nTransaction completed, but there was an error generating the confirmation message.");
                            }
                        }
                    }
                }
            }
        }

        String aiResponse = finalResponse.toString().trim();

        if (aiResponse.isEmpty() && !response.text().isEmpty()) {
            aiResponse = response.text();
        }

        lucAI.getConversationHistory().add(new LucAIPrompt(userPrompt, aiResponse, Instant.now()));
        lucAI.setUpdatedAt(Instant.now());
        lucaAIRepository.save(lucAI);

        logger.info("Prompt processed successfully for user {}", userId);
        return ResponseEntity.ok(PromptResponseDTO.success("Generated successfully!", aiResponse));
    }

    private String executeFunctionCall(String functionName, Map<String, Object> args, UUID userId) {
        try {
            return switch (functionName) {
                case "create_expense" -> createExpenseFromArgs(args, userId);
                case "create_income" -> createIncomeFromArgs(args, userId);
                default -> "Unknown function: " + functionName;
            };
        } catch (Exception e) {
            logger.error("Error executing function {}: ", functionName, e);
            return "Error executing function: " + e.getMessage();
        }
    }

    private String createExpenseFromArgs(Map<String, Object> args, UUID userId) {
        try {
            String title = (String) args.get("title");
            String description = (String) args.getOrDefault("description", "");
            String categoryStr = (String) args.get("category");
            Number amountNum = (Number) args.get("amount");
            Object transactionDateObj = args.get("transactionDate");
            Instant transactionDate = null;

            if (transactionDateObj != null) {
                if (transactionDateObj instanceof String) {
                    try {
                        transactionDate = Instant.parse((String) transactionDateObj);
                    } catch (Exception exception) {
                        logger.warn("Failed to parse transactionDate: {}", transactionDateObj);
                        transactionDate = Instant.now();
                    }
                } else if (transactionDateObj instanceof Instant) {
                    transactionDate = (Instant) transactionDateObj;
                }
            }

            if (transactionDate == null) {
                transactionDate = Instant.now();
            }

            if (title == null || categoryStr == null || amountNum == null) {
                return "Error: Missing required fields (title, category, or amount)";
            }


            CreateExpenseRequestDTO dto = new CreateExpenseRequestDTO(
                    userId,
                    title,
                    description,
                    ExpenseCategory.valueOf(categoryStr),
                    BigDecimal.valueOf(amountNum.doubleValue()),
                    transactionDate
            );

            ResponseEntity<ExpenseResponseDTO> response = expenseService.createExpense(dto, userId);

            if (response.getStatusCode() == HttpStatus.CREATED) {
                logger.info("Expense created successfully via LucAI: {} - ${}", title, amountNum);
                return String.format("SUCCESS: Expense '%s' of $%.2f in category %s was created successfully.",
                        title, amountNum.doubleValue(), categoryStr);
            } else {
                String errorMsg = response.getBody() != null ? response.getBody().message() : "Unknown error";
                logger.warn("Failed to create expense via LucAI: {}", errorMsg);
                return "ERROR: Failed to create expense - " + errorMsg;
            }
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid category for expense: {}", e.getMessage());
            return "ERROR: Invalid category. Please use one of: FOOD, TRANSPORT, HOUSING, ENTERTAINMENT, HEALTH, EDUCATION, OTHER";
        } catch (Exception e) {
            logger.error("Unexpected error creating expense: ", e);
            return "ERROR: Unexpected error - " + e.getMessage();
        }
    }

    private String createIncomeFromArgs(Map<String, Object> args, UUID userId) {
        try {
            String title = (String) args.get("title");
            String description = (String) args.getOrDefault("description", "");
            String categoryStr = (String) args.get("category");
            Number amountNum = (Number) args.get("amount");
            Object transactionDateObj = args.get("transactionDate");
            Instant transactionDate = null;

            if (transactionDateObj != null) {
                if (transactionDateObj instanceof String) {
                    try {
                        transactionDate = Instant.parse((String) transactionDateObj);
                    } catch (Exception exception) {
                        logger.warn("Failed to parse transactionDate: {}", transactionDateObj);
                        transactionDate = Instant.now();
                    }
                } else if (transactionDateObj instanceof Instant) {
                    transactionDate = Instant.now();
                }
            }

            if (transactionDate == null) {
                transactionDate = Instant.now();
            }

            if (title == null || categoryStr == null || amountNum == null) {
                return "Error: Missing required fields (title, category, or amount)";
            }

            CreateIncomeRequestDTO dto = new CreateIncomeRequestDTO(
                    userId,
                    title,
                    description,
                    IncomeCategory.valueOf(categoryStr),
                    BigDecimal.valueOf(amountNum.doubleValue()),
                    transactionDate
            );

            ResponseEntity<IncomeResponseDTO> response = incomeService.createIncome(dto, userId);

            if (response.getStatusCode() == HttpStatus.CREATED) {
                logger.info("Income created successfully via LucAI: {} - ${}", title, amountNum);
                return String.format("SUCCESS: Income '%s' of $%.2f in category %s was created successfully.",
                        title, amountNum.doubleValue(), categoryStr);
            } else {
                String errorMsg = response.getBody() != null ? response.getBody().message() : "Unknown error";
                logger.warn("Failed to create income via LucAI: {}", errorMsg);
                return "ERROR: Failed to create income - " + errorMsg;
            }
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid category for income: {}", e.getMessage());
            return "ERROR: Invalid category. Please use one of: SALARY, FREELANCE, INVESTMENT, GIFT, OTHER";
        } catch (Exception e) {
            logger.error("Unexpected error creating income: ", e);
            return "ERROR: Unexpected error - " + e.getMessage();
        }
    }
}