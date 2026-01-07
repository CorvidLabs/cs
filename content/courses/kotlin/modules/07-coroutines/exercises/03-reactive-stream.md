---
title: Reactive Stream
order: 3
difficulty: hard
estimatedMinutes: 30
---

# Exercise: Reactive Stream with Flow

Build a reactive data pipeline using Kotlin Flow.

## Requirements

1. Create a flow that emits sensor readings
2. Apply transformations (filter, map, sample)
3. Handle errors gracefully
4. Collect and display results

## Starter Code

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.random.Random

data class SensorReading(val value: Double, val timestamp: Long)

// Create a flow of sensor readings
fun sensorReadings(): Flow<SensorReading> = flow {
    // Emit readings every 100ms for 2 seconds
}

// Process readings pipeline
fun processSensorData(readings: Flow<SensorReading>): Flow<String> {
    // 1. Filter out invalid readings (< 0 or > 100)
    // 2. Map to formatted string
    // 3. Take only significant changes (> 5 difference from last)
}

fun main() = runBlocking {
    println("Starting sensor monitoring...")

    processSensorData(sensorReadings())
        .collect { reading ->
            println(reading)
        }

    println("Monitoring complete")
}
```

## Expected Output (will vary)

```
Starting sensor monitoring...
Reading: 45.2 at 1000ms
Reading: 67.8 at 1300ms
Reading: 23.1 at 1600ms
Reading: 89.5 at 1900ms
Monitoring complete
```

## Solution

<details>
<summary>Click to reveal solution</summary>

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.random.Random

data class SensorReading(val value: Double, val timestamp: Long)

fun sensorReadings(): Flow<SensorReading> = flow {
    val startTime = System.currentTimeMillis()
    repeat(20) {
        delay(100)
        val value = Random.nextDouble(-10.0, 110.0)
        val timestamp = System.currentTimeMillis() - startTime
        emit(SensorReading(value, timestamp))
    }
}

fun processSensorData(readings: Flow<SensorReading>): Flow<String> {
    var lastValue = Double.MIN_VALUE

    return readings
        .filter { it.value in 0.0..100.0 }  // Valid range
        .filter { reading ->
            val significant = kotlin.math.abs(reading.value - lastValue) > 5
            if (significant) lastValue = reading.value
            significant
        }
        .map { "Reading: ${"%.1f".format(it.value)} at ${it.timestamp}ms" }
        .catch { e ->
            emit("Error: ${e.message}")
        }
}

fun main() = runBlocking {
    println("Starting sensor monitoring...")

    processSensorData(sensorReadings())
        .collect { reading ->
            println(reading)
        }

    println("Monitoring complete")
}
```
</details>

## Bonus Challenge

1. Add a `sample` operator to only take readings every 500ms
2. Create a StateFlow to track the latest reading
3. Add a timeout that stops collection after 5 seconds
4. Collect readings from two sensors and merge them
