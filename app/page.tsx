"use client"

import { useState, useEffect } from "react";
import { RestaurantCard } from "./components/restaurant-card"
import { ExpandedCard } from "./components/expanded-card";

type Restaurants = {
  name: string;
  menu: {
    name: string;
    diet: string[];
    recipeId: number;
    iconUrl: string;
  }[];
};

export default function Home() {
  const [restaurantData, setRestaurantData] = useState<Restaurants[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const handleCardExpansion = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id)
  }

  const expandedRestaurant = restaurantData.find((restaurant) => restaurant.name === expandedCardId)

  async function fetchLunchData() {
    const response = await fetch("/api/lunch")
    const data = await response.json()
    console.log("fetched lunch data", data)
    setRestaurantData(data)
    setLoading(false)
  }
  
  useEffect(() => {
    fetchLunchData()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8 relative">
      {expandedCardId && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-10"
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
            restaurantData.map((restaurant) => (
              <RestaurantCard
                key={restaurant.name}
                name={restaurant.name}
                desc="Today's lunch"
                menu={restaurant.menu}
                onClick={() => handleCardExpansion(restaurant.name)}
              />
            ))
          )}
        </div>
      </section>

      {expandedCardId && expandedRestaurant && (
        <ExpandedCard
          className="z-20 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          name={expandedRestaurant.name}
          desc="Affordable student lunch options."
          menu={expandedRestaurant.menu}
        />
      )}
    </main>
  )
}
