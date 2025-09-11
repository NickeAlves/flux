"use client";

import { useState } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<"/" | "*" | "-" | "+" | null>(null);
  const [waitingForNewOperand, setWaitingForNewOperand] =
    useState<boolean>(false);

  const inputDigit = (digit: string) => {
    setDisplay((current) => {
      if (waitingForNewOperand) {
        setWaitingForNewOperand(false);
        return digit === "." ? "0." : digit;
      }
      if (digit === ".") {
        if (current.includes(".")) return current;
        return current + ".";
      }
      if (current === "0") return digit;
      return current + digit;
    });
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewOperand(false);
  };

  const toggleSign = () => {
    setDisplay((d) =>
      d.startsWith("-") ? d.slice(1) : d === "0" ? d : "-" + d
    );
  };

  const percent = () => {
    setDisplay((d) => {
      const value = parseFloat(d);
      if (Number.isNaN(value)) return d;
      return String(value / 100);
    });
  };

  const performOperation = (nextOperator: "/" | "*" | "-" | "+") => {
    const inputValue = parseFloat(display);
    if (previousValue == null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue;
      let result = currentValue;
      if (operator === "+") result = currentValue + inputValue;
      if (operator === "-") result = currentValue - inputValue;
      if (operator === "*") result = currentValue * inputValue;
      if (operator === "/")
        result = inputValue === 0 ? NaN : currentValue / inputValue;
      setPreviousValue(result);
      setDisplay(String(result));
    }
    setOperator(nextOperator);
    setWaitingForNewOperand(true);
  };

  const equals = () => {
    const inputValue = parseFloat(display);
    if (previousValue != null && operator) {
      let result = previousValue;
      if (operator === "+") result = previousValue + inputValue;
      if (operator === "-") result = previousValue - inputValue;
      if (operator === "*") result = previousValue * inputValue;
      if (operator === "/")
        result = inputValue === 0 ? NaN : previousValue / inputValue;
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewOperand(true);
    }
  };

  const Button = ({
    children,
    onClick,
    variant = "default",
    className = "",
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "default" | "operator" | "function";
    className?: string;
  }) => {
    const base =
      "h-14 rounded-full text-lg select-none focus:outline-none focus:ring-2 focus:ring-gray-300 transition active:scale-95";
    const variants = {
      default: "bg-gray-200 hover:bg-gray-300 text-black",
      operator: "bg-orange-500 hover:bg-orange-600 text-white",
      function: "bg-gray-300 hover:bg-gray-400 text-black",
    } as const;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="w-full max-w-sm p-6">
      <div className="bg-black text-right text-white rounded-3xl p-5 mb-4">
        <div className="text-4xl font-light tabular-nums leading-none break-all min-h-12">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Button variant="function" onClick={clear}>
          AC
        </Button>
        <Button variant="function" onClick={toggleSign}>
          +/-
        </Button>
        <Button variant="function" onClick={percent}>
          %
        </Button>
        <Button variant="operator" onClick={() => performOperation("/")}>
          ÷
        </Button>

        <Button onClick={() => inputDigit("7")}>7</Button>
        <Button onClick={() => inputDigit("8")}>8</Button>
        <Button onClick={() => inputDigit("9")}>9</Button>
        <Button variant="operator" onClick={() => performOperation("*")}>
          ×
        </Button>

        <Button onClick={() => inputDigit("4")}>4</Button>
        <Button onClick={() => inputDigit("5")}>5</Button>
        <Button onClick={() => inputDigit("6")}>6</Button>
        <Button variant="operator" onClick={() => performOperation("-")}>
          −
        </Button>

        <Button onClick={() => inputDigit("1")}>1</Button>
        <Button onClick={() => inputDigit("2")}>2</Button>
        <Button onClick={() => inputDigit("3")}>3</Button>
        <Button variant="operator" onClick={() => performOperation("+")}>
          +
        </Button>

        <Button className="col-span-2" onClick={() => inputDigit("0")}>
          0
        </Button>
        <Button onClick={() => inputDigit(".")}>.</Button>
        <Button variant="operator" onClick={equals}>
          =
        </Button>
      </div>
    </div>
  );
}
