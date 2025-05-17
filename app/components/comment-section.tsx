import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

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

type CommentSectionProps = {
  restaurantId: string;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentSection = ({ restaurantId, comments, onAddComment, onDeleteComment }: CommentSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(0)

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between p-4 border-t">
        <h3 className="text-lg font-semibold">Comments</h3>
        <Button
          variant="ghost"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          {showCommentForm ? "Cancel" : "Add Comment"}
        </Button>
      </div>

      {showCommentForm && (
        <form className="space-y-3 p-3 border rounded-md bg-muted/30">
          <div className="flex items-center space-x-1">
            <span className="text-sm mr-2">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none">
                <StarIcon
                  className={cn("h-5 w-5", newRating >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            className="resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!newComment.trim() || newRating === 0}>
              Post Review
            </Button>
          </div>
        </form>
      )}

      <div className="p-4 rounded-md border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="https://github.com/jaakkonurm.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium ml-2">Jaakko Nurminen</span>
          </div>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={cn("h-5 w-5", 4 >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm">Hyviä viboja, voisin käydä toistekkin!</p>
      </div>
    </div>
  )
}