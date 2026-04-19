import { useMemo, useState, type ChangeEvent } from "react";

const FOOD_HYDRATION_SHARE = 0.15;

function getWaterLitersPerDay(age: number, weight: number) {
   const mlPerKg = age < 18 ? 40 : age <= 55 ? 35 : age <= 75 ? 30 : 25;
   const adjustedMlPerKg = mlPerKg * (1 - FOOD_HYDRATION_SHARE);
   const liters = (weight * adjustedMlPerKg) / 1000;

   return Number(liters.toFixed(2));
}

export function CaffeineCalculator() {
   const [age, setAge] = useState(30);
   const [weight, setWeight] = useState(75);

   const litersPerDay = useMemo(() => {
      if (age <= 0 || weight <= 0) {
         return null;
      }

      return getWaterLitersPerDay(age, weight);
   }, [age, weight]);

   const handleAgeChange = (event: ChangeEvent<HTMLInputElement>) => {
      setAge(Number(event.target.value));
   };

   const handleWeightChange = (event: ChangeEvent<HTMLInputElement>) => {
      setWeight(Number(event.target.value));
   };

   return (
      <section className="mx-auto my-4 w-full max-w-xl rounded-2xl border border-border bg-background-secondary p-6">
         <h2 className="text-xl font-semibold text-foreground">Kalkulator nawodnienia</h2>
         <p className="mt-2 text-sm text-foreground-secondary">
            Podaj wiek i wagę, a wyliczę orientacyjne dzienne spożycie wody do wypicia.
         </p>

         <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-foreground">
               Wiek
               <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={handleAgeChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
               />
            </label>

            <label className="flex flex-col gap-2 text-sm text-foreground">
               Waga (kg)
               <input
                  type="number"
                  min={1}
                  max={300}
                  value={weight}
                  onChange={handleWeightChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
               />
            </label>
         </div>

         <div className="mt-6 rounded-xl border border-border bg-background p-4 text-center">
            {litersPerDay === null ? (
               <p className="text-sm text-red-400">Wpisz poprawny wiek i wagę większe od zera.</p>
            ) : (
               <p className="text-base text-foreground">
                  Pij około <strong className="text-accent">{litersPerDay} l</strong> wody dziennie.
               </p>
            )}
         </div>
      </section>
   );
}
