import { supabase } from "./ReactQueryApp";

// fetch functions, getting data from Supabase using react-query
// sometimes we will need to get individual rows instead of all of the rows
// like fetchOneBathroom for the case where a user lands on /bathrooms/:bathroom_id without first going to any other page where we get all of the bathrooms
export async function fetchUsers() {
  const { data, error } = await supabase.from("users").select();
  return data;
}

export async function fetchOneUser(params) {
  const { data, error } = await supabase.from("users").select().eq('id', params.id); 
  return data;
}

export async function fetchOneUserBathrooms(params) {
  const { data, error } = await supabase.from("bathrooms").select().eq('submitted_by', params.id); 
  return data;
}

export async function fetchOneUserReviews(params) {
  const { data, error } = await supabase.from("reviews").select().eq('user_id', params.id);
  return data;
}

export async function fetchOneUserFavorites(params) {
  const { data, error } = await supabase.from("favorites").select().eq('user_id', params.id); 
  return data;
}

///

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

export async function fetchOneBathroomReviewsUsers (paramsArray) {
  console.log(paramsArray)
  let searchArray = []
  paramsArray.forEach((p) => searchArray.push(p.id))
  const {data, error } = await supabase.from('users').select().eq('id', searchArray)
  return data
}

///

export async function fetchReviews() {
  const { data, error } = await supabase.from("reviews").select();
  return data;
}

export async function fetchOneBathroomReviews(params) {
  const { data, error } = await supabase.from('reviews').select().eq('bathroom_id', params.bathroomid) 
  return data
}

///

export async function fetchFavorites() {
  const { data, error } = await supabase.from("favorites").select();
  return data;
}

export async function fetchOneBathroomFavorites(params) {
  const { data, error } = await supabase.from('favorites').select().eq('bathroom_id', params.bathroomid) 
  return data
}
