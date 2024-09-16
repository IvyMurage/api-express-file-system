const express = require("express")
const fs = require("fs").promises
const path = require("path")
const app = express()

const PORT = 3000

app.use(express.json())

const filePath = path.join(__dirname, "data", "cars.json")

const readData = async () => {
  try {
    const cars = await fs.readFile(filePath)
    return JSON.parse(cars)
  } catch (error) {
    throw new Error(error)
  }
}

const writeData = async data => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data))
  } catch (error) {
    throw new Error(error)
  }
}

app.get("/cars", async (req, res) => {
  try {
    const cars = await readData()
    res.status(200).json(cars)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

app.get("/cars/:id", async (req, res) => {
  try {
    const cars = await readData()
    const { id } = req.params
    const car = cars.find(car => car.id === Number(id))
    if (!car) return res.status(404).send({ message: "Car not found" })

    res.status(200).json(car)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

app.post("/cars", async (req, res) => {
  try {
    const cars = await readData()
    console.log(cars)
    const newCar = { id: cars.length + 1, ...req.body }
    cars.push(newCar)
    await writeData(cars)
    res.status(201).json(newCar)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

app.put("/cars/:id", async (req, res) => {
  try {
    const cars = await readData()
    const { id: paramId } = req.params
    const index = cars.findIndex(({ id }) => id === Number(paramId))
    if (index === -1) return res.status(404).send({ message: "car not found" })
    const updatedCar = { id: index, ...req.body }
    cars[index] = updatedCar
    await writeData(cars)
    res.status(201).json(updatedCar)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

app.delete("/cars/:id", async (req, res) => {
  try {
    const cars = await readData()
    const { id: paramId } = req.params
    const car = cars.find(({ id }) => id === Number(paramId))

    if (!car) return res.status(404).send({ message: "car not found" })
    const filteredCars = cars.filter(({ id }) => id !== Number(paramId))
    await writeData(filteredCars)
    res.status(200).send({ message: "car deleted successfully!" })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`)
})
