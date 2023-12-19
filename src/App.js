import { useState, useEffect } from "react";
import { currencies } from "./assets/constant";
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

export default function App() {
  const [amount, setAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [beforeTrans, setBeforeTrans] = useState(currencies.at(0).value);
  const [afterTrans, setAfterTrans] = useState(currencies.at(0).value);
  useEffect(() => {
    console.log(beforeTrans, afterTrans, amount);

    const controller = new AbortController();
    const fetchAmount = async () => {
      setFinalAmount("loading...");
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${beforeTrans}&to=${afterTrans}`,
        { signal: controller.signal }
      );
      console.log(res);
      if (!res.ok || res.status !== 200) {
        throw new Error("error");
      }
      const data = await res.json();
      console.log(data);
      setFinalAmount(data.rates[afterTrans]);
    };
    if (beforeTrans !== afterTrans && amount !== "") fetchAmount();
    return function () {
      controller.abort();
    };
  }, [amount, beforeTrans, afterTrans]);
  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        value={beforeTrans}
        onChange={(e) => setBeforeTrans(e.target.value)}
      >
        {currencies.map((currency) => {
          return (
            <option key={`${currency.title}1`} value={currency.value}>
              {currency.title}
            </option>
          );
        })}
      </select>
      <select
        value={afterTrans}
        onChange={(e) => setAfterTrans(e.target.value)}
      >
        {currencies.map((currency) => {
          return (
            <option key={currency.title} value={currency.value}>
              {currency.title}
            </option>
          );
        })}
      </select>
      <p>{finalAmount}</p>
    </div>
  );
}
