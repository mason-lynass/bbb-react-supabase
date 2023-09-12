import { useQuery } from "@tanstack/react-query";
import { supabase } from "./NewApp";

// fetch functions, getting data from Supabase using react-query
// sometimes we will need to get individual rows instead of all of the rows
// like fetchOneBathroom for the case where a user lands on /bathrooms/:bathroom_id without first going to any other page where we get all of the bathrooms
export async function fetchUsers() {
  const { data, error } = await supabase.from("users").select(); // get the data from Supabase
  return data;
}

export async function fetchBathrooms() {
  const { data, error } = await supabase.from("bathrooms").select();
  return data;
}

export async function fetchOneBathroom(params) {
  const { data, error } = await supabase
    .from("bathrooms")
    .select()
    .eq("id", params.bathroomid);
  return data[0];
}

export async function fetchReviews() {
  const { data, error } = await supabase.from("reviews").select();
  return data;
}

export async function fetchFavorites() {
  const { data, error } = await supabase.from("favorites").select();
  return data;
}
