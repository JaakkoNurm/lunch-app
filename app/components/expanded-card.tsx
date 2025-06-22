import { useState, useEffect } from "react"
import { fetchComments } from "../services/api"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { PriceIndicator } from "./price-indicator"
import { CommentSection } from "./comment-section"
import { cn } from "@/app/utils/cn"

type ExpandedCardProps = {
  id: number;
  name: string;
  imgBytes: string;
  desc: string;
  menu: {
    mealName: string;
    mealPrice: string;
    diets: string[];
  }[];
  className?: string;
}

type Comment = {
  id: string;
  user: {
    name: string;
    avatar?: string;
  }
  text: string;
  rating: number;
  date: string;
}

export const ExpandedCard = ({ id, name, imgBytes, desc, menu, className }: ExpandedCardProps) => {
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])

  const fetchCommentData = async () => {
    setCommentsLoading(true)
    const response = await fetchComments(id)
    setComments(response)
    setCommentsLoading(false)
  }

  useEffect(() => {
    fetchCommentData()
  }, [])
  
  return (
    <Card
      className={cn("w-full max-w-[60%] max-h-[80vh] overflow-y-auto", className)}
    >
      <Image
        className="rounded ml-auto mr-auto mt-4"
        src={`data:image/jpeg;base64,${imgBytes}`}
        alt="restaurant name"
        width={480}
        height={240}
      />
      <CardContent>
        <h2 className="text-2xl font-bold mt-8">
          {name}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {desc}
        </p>
        <p>
          Today's lunch
        </p>
        <ul className="list-disc list-inside mt-2">
          {menu.length > 0 ? (
            menu.map((item) => (
              <li key={item.mealName}>
                {item.mealName}: {item.mealPrice}
              </li>
            ))
          ) : (
            <li>No menu available for today</li>
          )}
        </ul>
        <CommentSection
          restaurantId={id}
          comments={comments}
          setComments={setComments}
          commentsLoading={commentsLoading}
          fetchCommentData={fetchCommentData}
        />
      </CardContent>
      <CardFooter className="px-4 py-3 border-t bg-muted/30">
        <div className="flex justify-between w-full text-sm">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
            <span className="text-sm font-medium">
              {comments.length > 0
                ? (comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length).toFixed(1)
                : "No reviews"}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}