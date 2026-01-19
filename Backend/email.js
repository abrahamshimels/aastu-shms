/**
 * FULL SMTP DEBUG SCRIPT
 * Domain: onchaintrustedcrypto.com
 * Goal: Identify EXACT failure stage (DNS, TCP, TLS, AUTH, SEND)
 */

import nodemailer from "nodemailer";
import dns from "dns";
import net from "net";

// ================== CONFIG ==================
const SMTP_HOST = "mail.onchaintrustedcrypto.com";
const SMTP_PORT = 587;
const SMTP_USER = "ehealth@onchaintrustedcrypto.com";
const SMTP_PASS = "Abcd1234567891011121314";
// ============================================

function logStage(stage) {
    console.log(`\n==================== ${stage} ====================`);
}

async function testEmail() {
    console.log("🚀 STARTING FULL SMTP DEBUG\n");

    /* -------------------------------------------------
     * 1️⃣ DNS RESOLUTION
     * ------------------------------------------------- */
    logStage("DNS RESOLUTION");
    try {
        const addresses = await dns.promises.resolve4(SMTP_HOST);
        console.log("✅ DNS resolved:", addresses);
    } catch (err) {
        console.error("❌ DNS FAILED");
        console.error(err);
        return;
    }

    /* -------------------------------------------------
     * 2️⃣ TCP CONNECTION TEST
     * ------------------------------------------------- */
    logStage("TCP CONNECTION");
    await new Promise((resolve, reject) => {
        const socket = net.createConnection(SMTP_PORT, SMTP_HOST);
        socket.setTimeout(5000);

        socket.on("connect", () => {
            console.log("✅ TCP connection established");
            socket.destroy();
            resolve();
        });

        socket.on("timeout", () => {
            console.error("❌ TCP TIMEOUT");
            socket.destroy();
            reject(new Error("TCP timeout"));
        });

        socket.on("error", (err) => {
            console.error("❌ TCP ERROR");
            console.error(err);
            reject(err);
        });
    }).catch(() => {
        console.error("🛑 STOPPED AT TCP STAGE");
        return;
    });

    /* -------------------------------------------------
     * 3️⃣ CREATE TRANSPORTER
     * ------------------------------------------------- */
    logStage("CREATE SMTP TRANSPORTER");

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false, // MUST be false for 587
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
        authMethod: "LOGIN", // 🔑 force cPanel-compatible auth
        requireTLS: true,
        tls: {
            rejectUnauthorized: false,
        },
        logger: true, // SMTP protocol logs
        debug: true,  // AUTH + TLS details
    });

    /* -------------------------------------------------
     * 4️⃣ VERIFY (TLS + AUTH)
     * ------------------------------------------------- */
    logStage("SMTP VERIFY (TLS + AUTH)");

    try {
        await transporter.verify();
        console.log("✅ SMTP VERIFY SUCCESS");
    } catch (err) {
        console.error("❌ SMTP VERIFY FAILED");
        classifyError(err);
        return;
    }

    /* -------------------------------------------------
     * 5️⃣ SEND EMAIL
     * ------------------------------------------------- */
    logStage("SEND MAIL");

    try {
        const info = await transporter.sendMail({
            from: `"E-Health Debug" <${SMTP_USER}>`,
            to: "shimelsabraham123@gmail.com",
            subject: "SMTP DEBUG SUCCESS ✅",
            text: "If you received this, SMTP AUTH + SEND works.",
        });

        console.log("✅ EMAIL SENT");
        console.log("📨 Message ID:", info.messageId);
        console.log("📬 Accepted:", info.accepted);
        console.log("📭 Rejected:", info.rejected);
    } catch (err) {
        console.error("❌ SEND FAILED");
        classifyError(err);
    }

    console.log("\n🎉 SMTP DEBUG COMPLETED");
}

/* -------------------------------------------------
 * ERROR CLASSIFIER (MOST IMPORTANT PART)
 * ------------------------------------------------- */
function classifyError(err) {
    console.error("🔍 ERROR ANALYSIS");

    if (err.code === "EAUTH") {
        console.error("🚨 AUTHENTICATION FAILED");
        console.error("CAUSE: Username or password rejected by SMTP server");
        console.error("FIX:");
        console.error(" - Ensure this is a REAL mailbox");
        console.error(" - Reset password in cPanel Email Accounts");
        console.error(" - No trailing spaces");
    }
    else if (err.code === "ESOCKET") {
        console.error("🚨 SOCKET ERROR");
        console.error("CAUSE: Network or TLS handshake failure");
    }
    else if (err.responseCode === 535) {
        console.error("🚨 SMTP 535 AUTH ERROR");
        console.error("CAUSE: Server explicitly rejected credentials");
    }
    else if (err.responseCode === 530) {
        console.error("🚨 SMTP 530");
        console.error("CAUSE: Authentication required or TLS missing");
    }
    else {
        console.error("🚨 UNKNOWN ERROR TYPE");
    }

    console.error("\n📄 RAW ERROR:");
    console.error(err);
}

// Run
testEmail().catch((e) => {
    console.error("🔥 FATAL UNCAUGHT ERROR");
    console.error(e);
});
