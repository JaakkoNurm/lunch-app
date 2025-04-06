"use client"

import Image from "next/image"
import { useState, useEffect } from "react";
import { RestaurantCard } from "./components/restaurant-card"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

type LunchData = {
  restaurant: string;
  menu: {
    name: string;
    diet: string[];
    recipeId: number;
    iconUrl: string;
  }[];
};

export default function Home() {
  const [lunchData, setLunchData] = useState<LunchData[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const handleCardExpansion = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id)
  }

  const expandedRestaurant = lunchData.find((restaurant) => restaurant.restaurant === expandedCardId)

  async function fetchLunchData() {
    const response = await fetch("/api/lunch")
    const data = await response.json()
    console.log("fetched lunch data", data)
    setLunchData(data)
    setLoading(false)
  }
  
  useEffect(() => {
    fetchLunchData()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8 relative">
      {expandedCardId && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          onClick={() => setExpandedCardId(null)}
        />
      )}

      <h1 className="text-3xl font-bold mb-4">Today's Lunch</h1>
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <p className="text-center text-gray-500">Loading...</p>
            </div>
          ) : (
            lunchData.map((restaurantData) => (
              <RestaurantCard
                key={restaurantData.restaurant}
                name={restaurantData.restaurant}
                desc="Today's lunch"
                menu={restaurantData.menu}
                onClick={() => handleCardExpansion(restaurantData.restaurant)}
              />
            ))
          )}
        </div>
      </section>

      {expandedCardId && expandedRestaurant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedCardId(null)}
        >
          <Card
            className="w-full max-w-[80%] max-h-[80vh] overflow-y-auto"
          >
            <Image
              src="/restaurant-placeholder.svg"
              alt="restaurant name"
              width={384}
              height={192}
            />
            <CardContent>
              <h2 className="text-2xl font-bold mt-8 mb-4">
                {expandedRestaurant.restaurant}
              </h2>
              <p>
                Today's lunch
              </p>
              <ul className="list-disc list-inside mt-4">
                {expandedRestaurant.menu.map((item) => (
                  <li key={item.name}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t bg-muted/30">
              <div className="flex justify-between w-full text-sm">
                <span>pricing</span>
                <span>reviews</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  )
}
