import { create } from 'zustand'

export const globalStore = create((set) => ({
    session: null,
    setSessiony: (input) => set(() => ({session: input})),
    profile: null,
    setProfile: (input) => set(() => ({profile: input})),
    users: [],
    setUsers: (input) => set(() => ({users: input})),
    bathrooms: [],
    setBathrooms: (input) => set(() => ({bathrooms: input})),
    reviews: [],
    setReviews: (input) => set(() => ({reviews: input})),
    favorites: [],
    setFavorites: (input) => set(() => ({favorites: input})),
    allowGeolocation: null,
    setGeolocation: (input) => set(() => ({setGeolocation: input})),
    tempUserLocation: null,
}))