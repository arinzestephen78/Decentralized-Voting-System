import { describe, it, expect, beforeEach } from "vitest"

// Simulating contract state
let voteCounts: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let countingComplete = false
const CONTRACT_OWNER = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"

// Simulating contract functions
function startCounting(caller: string, ballotContract: string) {
  if (caller !== CONTRACT_OWNER) throw new Error("ERR_NOT_AUTHORIZED")
  if (countingComplete) throw new Error("ERR_COUNTING_IN_PROGRESS")
  // Simulating vote counting
  voteCounts = [10, 20, 15, 5, 0, 0, 0, 0, 0, 0]
  countingComplete = true
  return true
}

function resetCounting(caller: string) {
  if (caller !== CONTRACT_OWNER) throw new Error("ERR_NOT_AUTHORIZED")
  voteCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  countingComplete = false
  return true
}

function getVoteCounts() {
  return voteCounts
}

function isCountingComplete() {
  return countingComplete
}

describe("Vote Counting Contract", () => {
  beforeEach(() => {
    voteCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    countingComplete = false
  })
  
  it("should start counting", () => {
    expect(startCounting(CONTRACT_OWNER, "ballot_contract")).toBe(true)
    expect(isCountingComplete()).toBe(true)
    expect(getVoteCounts()).toEqual([10, 20, 15, 5, 0, 0, 0, 0, 0, 0])
  })
  
  it("should reset counting", () => {
    startCounting(CONTRACT_OWNER, "ballot_contract")
    expect(resetCounting(CONTRACT_OWNER)).toBe(true)
    expect(isCountingComplete()).toBe(false)
    expect(getVoteCounts()).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  })
  
  it("should not allow non-owner to start counting", () => {
    expect(() => startCounting("nonowner", "ballot_contract")).toThrow("ERR_NOT_AUTHORIZED")
  })
  
  it("should not allow counting to start twice", () => {
    startCounting(CONTRACT_OWNER, "ballot_contract")
    expect(() => startCounting(CONTRACT_OWNER, "ballot_contract")).toThrow("ERR_COUNTING_IN_PROGRESS")
  })
})

