"use client"

import { useState, useEffect } from "react";
import { useAuth } from "./context/auth-context";
import { RestaurantCard } from "./components/restaurant-card"
import { ExpandedCard } from "./components/expanded-card";
import { Button } from "./components/ui/button";
import { AuthModal } from "./components/auth-modal";

type Restaurants = {
  id: number;
  locationName: string;
  restaurantName: string;
  openingHoursToday: string;
  image: string;
  url: string;
  menu: {
    mealName: string;
    mealPrice: string;
    diets: string[];
  }[];
};

export default function Home() {
  const [restaurantData, setRestaurantData] = useState<Restaurants[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const { user, logout } = useAuth()

  const handleCardExpansion = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id)
  }

  const expandedRestaurant = restaurantData.find((restaurant) => restaurant.id === expandedCardId)

  const fetchLunchData = async () => {
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
      <div className="flex flex-row justify-end mb-2">
        {user ? (
          <Button onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button onClick={() => setAuthModalOpen(true)}>
            Login
          </Button>
        )}
      </div>
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <p className="text-center text-gray-500">Loading...</p>
            </div>
          ) : (
            restaurantData.map((restaurant) => {
              const { id, restaurantName, menu, image } = restaurant;

              return (
                <RestaurantCard
                  key={`restaurant-${id}`}
                  name={restaurantName}
                  imgBytes={image}
                  desc="Today's lunch"
                  menu={menu}
                  onClick={() => handleCardExpansion(id)}
                />
              )})
          )}
        </div>
      </section>

      {expandedCardId && expandedRestaurant && (
        <ExpandedCard
          className="z-20 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          id={expandedRestaurant.id}
          name={expandedRestaurant.restaurantName}
          imgBytes={expandedRestaurant.image}
          desc="Affordable student lunch options."
          menu={expandedRestaurant.menu}
        />
      )}

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </main>
  )
}
