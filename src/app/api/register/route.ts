import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Always connect to the DB first
    await connectToDatabase();

    // 2. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 400 }
      );
    }

    // 3. Encrypt the password (salt it 10 times)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user in MongoDB
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student", // Default role
    });

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
    
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}