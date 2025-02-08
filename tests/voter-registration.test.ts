import { describe, it, expect, beforeEach } from "vitest"

// Simulating contract state
const voters = new Map<string, boolean>()
const eligibleVoters = new Map<string, boolean>()
const CONTRACT_OWNER = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"

// Simulating contract functions
function registerVoter(caller: string) {
  if (!eligibleVoters.get(caller)) throw new Error("ERR_NOT_ELIGIBLE")
  if (voters.get(caller)) throw new Error("ERR_ALREADY_REGISTERED")
  voters.set(caller, true)
  return true
}

function addEligibleVoter(caller: string, voter: string) {
  if (caller !== CONTRACT_OWNER) throw new Error("ERR_NOT_AUTHORIZED")
  eligibleVoters.set(voter, true)
  return true
}

function removeEligibleVoter(caller: string, voter: string) {
  if (caller !== CONTRACT_OWNER) throw new Error("ERR_NOT_AUTHORIZED")
  eligibleVoters.delete(voter)
  return true
}

function isRegistered(voter: string) {
  return voters.get(voter) || false
}

function isEligible(voter: string) {
  return eligibleVoters.get(voter) || false
}

describe("Voter Registration Contract", () => {
  beforeEach(() => {
    voters.clear()
    eligibleVoters.clear()
  })
  
  it("should add eligible voter", () => {
    expect(addEligibleVoter(CONTRACT_OWNER, "voter1")).toBe(true)
    expect(isEligible("voter1")).toBe(true)
  })
  
  it("should remove eligible voter", () => {
    addEligibleVoter(CONTRACT_OWNER, "voter1")
    expect(removeEligibleVoter(CONTRACT_OWNER, "voter1")).toBe(true)
    expect(isEligible("voter1")).toBe(false)
  })
  
  it("should register voter", () => {
    addEligibleVoter(CONTRACT_OWNER, "voter1")
    expect(registerVoter("voter1")).toBe(true)
    expect(isRegistered("voter1")).toBe(true)
  })
  
  it("should not register ineligible voter", () => {
    expect(() => registerVoter("voter1")).toThrow("ERR_NOT_ELIGIBLE")
  })
  
  it("should not register voter twice", () => {
    addEligibleVoter(CONTRACT_OWNER, "voter1")
    registerVoter("voter1")
    expect(() => registerVoter("voter1")).toThrow("ERR_ALREADY_REGISTERED")
  })
  
  it("should not allow non-owner to add eligible voter", () => {
    expect(() => addEligibleVoter("nonowner", "voter1")).toThrow("ERR_NOT_AUTHORIZED")
  })
})

