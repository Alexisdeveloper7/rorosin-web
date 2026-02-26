import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Borra la cookie de sesión
    const response = NextResponse.json({ message: "Sesión cerrada correctamente" });
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // expira inmediatamente
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 });
  }
}
