import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/auth-context"
import { postComment } from "@/app/services/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { StarIcon } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { cn } from "@/app/utils/cn"

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
  restaurantId: number;
  comments: Comment[];
  setComments: Function;
  commentsLoading: boolean;
  fetchCommentData: Function;
}

export const CommentSection = ({ restaurantId, comments, setComments, commentsLoading, fetchCommentData }: CommentSectionProps) => {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(0)

  const userContext = useAuth()['user']

  const handlePostReview = async (e: any) => {
    e.preventDefault()
    try {
      if (!userContext) {
        throw new Error("User must be logged in to post a comment.");
      }

      const response = await postComment(
        newComment,
        newRating,
        restaurantId,
        userContext.id,
        userContext.accessToken
      )
      const { success, id, date } = response
      if (success) {
        setComments([
          ...comments, {
          id,
          user: {
            name: userContext.username,
            avatar: userContext.profilePicture || undefined
          },
          text: newComment,
          rating: newRating,
          date,
        }])
      }
    } catch (error) {
      console.log(`Error while trying to register: ${error}`)
    }
  };

  if (commentsLoading) {
    return (
      <div>
        Loading comments...
      </div>
    )
  }

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
              <button key={star} disabled={!userContext} type="button" onClick={() => setNewRating(star)} className="focus:outline-none">
                <StarIcon
                  className={cn("h-5 w-5", newRating >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
                />
              </button>
            ))}
          </div>
          <Textarea
            disabled={!userContext}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            className="resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || newRating === 0 || !userContext}
              onClick={async (e) => {
                await handlePostReview(e)
                await fetchCommentData()
              }}
            >
              Post Review
            </Button>
          </div>
        </form>
      )}

      {comments && comments.map(comment => (
        <div key={comment.id} className="p-4 rounded-md border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={`data:image/jpeg;base64,${comment.user.avatar}`}
                  alt={`Comment from ${comment.user.name}`}
                />
                <AvatarFallback>{comment.user.name.substring(1, 3)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium ml-2">{comment.user.name}</span>
            </div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={cn("h-5 w-5", comment.rating >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm">{comment.text}</p>
        </div>
      ))}

    </div>
  )
}