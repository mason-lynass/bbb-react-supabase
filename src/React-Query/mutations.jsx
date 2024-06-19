import { supabase } from "../global/constants"
export function submitReview (review, id) {
    review.bathroom_id = id
    return supabase.from("reviews").insert(review).select()
}

export function submitBathroom (bathroom) {
    return supabase.from("bathrooms").insert(bathroom).select()
}