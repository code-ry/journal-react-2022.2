import React, { useEffect, useState } from "react"
import Navbar from "./Navbar"
import CategorySelection from "./CategorySelection"
import Home from "./Home"
import NewEntry from "./NewEntry"
import { Routes, Route, useParams, useNavigate } from "react-router-dom"
import ShowEntry from "./ShowEntry"

// const seedEntries = [
//   { category: "Food", content: "Pizza is awesome!" },
//   { category: "Work", content: "Another day, another dollar" },
//   { category: "Coding", content: "React is cool!" },
// ]

const App = () => {
  const [entries, setEntries] = useState([])
  const nav = useNavigate()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function getCategories() {
      const res = await fetch("https://journal-api-20222-production-705a.up.railway.app/categories")
      const data = await res.json()
      setCategories(data)
    }
    getCategories()
  }, [])

  // Only on mount
  useEffect(() => {
    async function fetchEntries() {
      const res = await fetch("https://journal-api-20222-production-705a.up.railway.app/entries")
      const data = await res.json()
      setEntries(data)
    }
    fetchEntries()
  }, [])

  // HOC (higher-order component)
  const ShowEntryWrapper = () => {
    const { id } = useParams()
    const the_entry = entries[id]
    return the_entry ? <ShowEntry entry={the_entry} /> : <h4>Entry not found!</h4>
  }

  const addEntry = async (category, content) => {
    const id = entries.length
    // const categoryObject = categories.find((cat) => cat.name === category)
    // Add a new entry
    const newEntry = {
      category: category,
      content: content,
    }
    // Post new entry to API
    const returnedEntry = await fetch("https://journal-api-20222-production-705a.up.railway.app/entries", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry)
    })
    const data = await returnedEntry.json()
    setEntries([...entries, data])
    nav(`/entry/${id}`)
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home entries={entries} />} />
        <Route path="/category" element={<CategorySelection categories={categories} />} />
        <Route path="/entry/:id" element={<ShowEntryWrapper />} />
        <Route path="/entry/new/:category" element={<NewEntry addEntry={addEntry} />} />
        <Route path="*" element={<h4>Page not found!</h4>} />
      </Routes>
    </>
  )
}

export default App
