import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "ADD_DIGIT",
  ALL_CLEAR: "ALL_CLEAR",
  CHOOSE_OPERATION: "CHOOSE_OPERATION",
  DELETE_DIGIT: "DELETE_DIGIT",
  EVALUATE: "EVALUATE",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperation: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperation === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperation.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperation: `${state.currentOperation || ""}${payload.digit}`,
      };
    case ACTIONS.ALL_CLEAR:
      return {};
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperation == null && state.previousOperation == null) {
        return state;
      }

      if (state.currentOperation === null) {
        return {
          ...state,
          operation: payload.operation
        }
      }


      if (state.previousOperation == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperation: state.currentOperation,
          currentOperation: null,
        };
      }

      return {
        ...state,
        previousOperation: evaluate(state),
        operation: payload.operation,
        currentOperation: null,
      };

    case ACTIONS.EVALUATE:
      if (state.currentOperation == null || state.previousOperation == null || state.operation == null){
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperation: null,
        operation: null,
        currentOperation: evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperation: null
        }
      }

      if (state.currentOperation === null) return state;
      if (state.currentOperation.length === 1){
        return {...state, currentOperation: null}
      }

      return {
        ...state,
        currentOperation: state.currentOperation.slice(0, -1)
      }
      default:
      return null;
  }
}

function evaluate({ currentOperation, previousOperation, operation }) {
  const previous = parseFloat(previousOperation);
  const current = parseFloat(currentOperation);
  if (isNaN(previous) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "÷":
      computation = previous / current;
      break;
    case "*":
      computation = previous * current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {maximimFractionDigits: 0,})

function formatOperation(operation) {
  if (operation == null) return
  const [integer, decimal] = operation.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperation, previousOperation, operation }, dispatch] =
    useReducer(reducer, {});

  return (
    <div className="App">
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-op">
            {formatOperation(previousOperation)} {operation}
          </div>
          <div className="current-op">{formatOperation(currentOperation)}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.ALL_CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  );
}

export default App;
