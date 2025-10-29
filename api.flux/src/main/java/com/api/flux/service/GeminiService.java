package com.api.flux.service;

import com.api.flux.dto.response.balance.ExpensesAndIncomesDTO;
import com.api.flux.dto.response.gemini.PromptResponseDTO;
import com.api.flux.entity.Expense;
import com.api.flux.entity.Income;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
            .withZone(ZoneId.systemDefault());

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final BalanceService balanceService;

    public GeminiService(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    public ResponseEntity<PromptResponseDTO> generatePrompt(String prompt, UUID userId) {
        try {
            Client client = Client.builder()
                    .apiKey(geminiApiKey)
                    .build();

            String financialContext = buildFinancialContext(userId);

            GenerateContentConfig config = GenerateContentConfig.builder()
                    .systemInstruction(Content.fromParts(Part.fromText(
                            "You are an AI agent named LucAI. You help users of a financial management platform manage their expenses, incomes, and balances. " +
                                    "You provide insights and advice on how to achieve their financial goals, suggesting ways to save money and improve budgeting. " +
                                    "You can identify recurring monthly expenses, summarize spending over the last 30 days, and highlight the categories where users have spent the most. " +
                                    "Always respond a friendly, helpful tone. " +
                                    "When analyzing data, be specific and provide actionable recommendations."
                    )))
                    .build();

            String fullPrompt = String.format(
                    "System Instruction: Please provide all responses in plain text without Markdown formatting. " +
                            "Do not use asterisks, backslashes, or formatting characters.\n\n" +
                            "USER FINANCIAL CONTEXT:\n%s\n\n" +
                            "USER QUESTION:\n%s",
                    financialContext,
                    prompt
            );

            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-pro",
                    fullPrompt,
                    config
            );

            if (Objects.requireNonNull(response.text()).isEmpty()) {
                logger.error("Empty response from Gemini API");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(PromptResponseDTO.error("Internal server error."));
            }

            logger.info("Prompt generated successfully for user {}", userId);
            return ResponseEntity.ok(PromptResponseDTO.success("Generated successfully!", response.text()));

        } catch (Exception e) {
            logger.error("Error generating prompt for user {}: ", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(PromptResponseDTO.error("Error processing your request: " + e.getMessage()));
        }
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
}