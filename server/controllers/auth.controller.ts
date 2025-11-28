import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { storage } from "../utilities/storage";
import { JWT_SECRET } from "../middleware/auth.middleware";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export async function login(req:any, res:any) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    
    await storage.deleteUserRefreshTokens(user.id);
    
    const accessToken = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiry = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);
    
    await storage.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: refreshTokenExpiry,
    });
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_EXPIRY,
    });
    
    res.json({ 
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
}

export async function refreshAccessToken(req: any, res: any) {
  try {
    const { refreshToken: oldRefreshToken } = req.cookies;
    
    if (!oldRefreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }
    
    const storedToken = await storage.getRefreshToken(oldRefreshToken);
    
    if (!storedToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    
    if (storedToken.expiresAt < new Date()) {
      await storage.deleteRefreshToken(oldRefreshToken);
      return res.status(403).json({ error: "Refresh token expired" });
    }
    
    const user = await storage.getUser(storedToken.userId);
    
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }
    
    await storage.deleteRefreshToken(oldRefreshToken);
    
    const accessToken = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiry = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);
    
    await storage.createRefreshToken({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: refreshTokenExpiry,
    });
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_EXPIRY,
    });
    
    res.json({ 
      success: true,
      message: "Token refreshed successfully"
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.cookies;
    
    if (refreshToken) {
      const storedToken = await storage.getRefreshToken(refreshToken);
      if (storedToken) {
        await storage.deleteUserRefreshTokens(storedToken.userId);
      }
    }
    
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    res.json({ 
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
}
