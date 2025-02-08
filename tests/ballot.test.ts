import { describe, it, expect, beforeEach } from "vitest"

// Simulating contract state
let ballotOptions: string[] = []
let ballotOpen = true
const votes = new Map<string, number>()
const CONTRACT_OWNER = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"

// Simulating contract functions
function createBallot(caller: string, options: string[]) {
  if (caller !== CONTRACT_OWNER) throw new Error("ERR_NOT_AUTHORIZED")
  ballotOptions = options
  ballotOpen = true
  return true
}

function closeBallot(caller: string) {
  if (caller !== CONTRACT_OWNER) throw new Error("ERR_NOT_AUTHORIZED")
  ballotOpen = false
  return true
}

function castVote(voter: string, option: number) {
  if (!ballotOpen) throw new Error("ERR_BALLOT_CLOSED")
  if (option >= ballotOptions.length) throw new Error("ERR_INVALID_OPTION")
  votes.set(voter, option)
  return true
}

function getBallotOptions() {
  return ballotOptions
}

function isBallotOpen() {
  return ballotOpen
}

function getVote(voter: string) {
  return votes.get(voter)
}

describe("Ballot Contract", () => {
  beforeEach(() => {
    ballotOptions = []
    ballotOpen = true
    votes.clear()
  })
  
  it("should create ballot", () => {
    const options = ["Option 1", "Option 2", "Option 3"]
    expect(createBallot(CONTRACT_OWNER, options)).toBe(true)
    expect(getBallotOptions()).toEqual(options)
  })
  
  it("should close ballot", () => {
    expect(closeBallot(CONTRACT_OWNER)).toBe(true)
    expect(isBallotOpen()).toBe(false)
  })
  
  it("should cast vote", () => {
    createBallot(CONTRACT_OWNER, ["Option 1", "Option 2"])
    expect(castVote("voter1", 1)).toBe(true)
    expect(getVote("voter1")).toBe(1)
  })
  
  it("should not allow voting on closed ballot", () => {
    createBallot(CONTRACT_OWNER, ["Option 1", "Option 2"])
    closeBallot(CONTRACT_OWNER)
    expect(() => castVote("voter1", 1)).toThrow("ERR_BALLOT_CLOSED")
  })
  
  it("should not allow voting for invalid option", () => {
    createBallot(CONTRACT_OWNER, ["Option 1", "Option 2"])
    expect(() => castVote("voter1", 2)).toThrow("ERR_INVALID_OPTION")
  })
  
  it("should not allow non-owner to create ballot", () => {
    expect(() => createBallot("nonowner", ["Option 1"])).toThrow("ERR_NOT_AUTHORIZED")
  })
})

