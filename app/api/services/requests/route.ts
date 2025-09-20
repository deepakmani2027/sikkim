import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({}))
    const id = `req_${Date.now()}`
    return NextResponse.json({ id, received: body }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 })
  }
}
