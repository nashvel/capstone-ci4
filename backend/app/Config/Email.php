<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Email extends BaseConfig
{
    // SMTP Configuration for sending email via Gmail
    public string $fromEmail = 'nacht.system@gmail.com';
    public string $fromName = 'Multi Cuisine Food Delivery';
    public string $SMTPHost = 'smtp.gmail.com';
    public int $SMTPPort = 587;
    public string $SMTPUser = 'nacht.system@gmail.com';
    public string $SMTPPass = 'nngl cwvj bapf zixr'; 
    public string $SMTPCrypto = 'tls'; 
    public string $emailCharset = 'UTF-8';

    // Mail protocol (for Gmail, this should be smtp)
    public string $protocol = 'smtp';

    // User agent for email client (for logging or debugging)
    public string $userAgent = 'CodeIgniter';

    // The server path to Sendmail (only used if the protocol is 'sendmail')
    public string $mailPath = '/usr/sbin/sendmail';

    // Enable word-wrap (for the email body)
    public bool $wordWrap = true;

    // Maximum character count to wrap text at
    public int $wrapChars = 76;

    // Type of mail (either 'text' or 'html')
    public string $mailType = 'html'; // Use 'html' for rich-text emails, 'text' for plain text

    // Charset for the email
    public string $charset = 'UTF-8';

    // Whether to validate the recipient's email address
    public bool $validate = false;

    // Email priority. 1 = highest, 5 = lowest, 3 = normal
    public int $priority = 3;

    // Newline characters for email content (ensure proper line breaks)
    public string $CRLF = "\r\n"; // Carriage Return and Line Feed
    public string $newline = "\r\n"; // Use "\n" or "\r\n" based on your server

    // Enable BCC Batch Mode (useful for bulk email sending)
    public bool $BCCBatchMode = false;

    // Number of emails in each BCC batch (used in BCCBatchMode)
    public int $BCCBatchSize = 200;

    // Enable DSN (Delivery Status Notification)
    public bool $DSN = false;
}
