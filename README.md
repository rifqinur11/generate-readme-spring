# Spring Boot README Generator 🚀

`spring-readme-generator` is an interactive CLI tool designed to automatically generate professional, standardized, and comprehensive `README.md` files for Spring Boot projects. By scanning project files and prompting developers with simple questions, it ensures your repository documentation is always top-notch, consistent, and junior-developer friendly.

---

## ✨ Features

*   **🔍 Automatic Project Inspection**: Auto-detects project build tool (Maven/`pom.xml`), target Java version, Spring Boot version, and project name (from `artifactId`).
*   **📦 Smart Dependency Mapping**: Scans your dependencies and auto-generates a clean, categorized technical stack table detailing used libraries (such as Spring Web, Spring Data JPA, Kafka, PostgreSQL, Lombok, Spring Security, Swagger UI, Actuator, and more).
*   **🛠️ Architecture-Specific Customization**: Generates specialized sections based on your project type:
    *   **Service / API**: Port configurations, base paths, and Swagger UI documentation links.
    *   **Batch Job**: Job name details and trigger mechanisms (e.g., cron schedules, API triggers).
    *   **Consumer / Worker**: Message brokers (Kafka, RabbitMQ, SQS), target topics/queues, and consumer group IDs.
*   **🚀 Production-Ready Templates**: Generates local running instructions, database/broker prerequisites, profile setups (`application-local.yaml`), and health check monitoring endpoints (`/actuator/health`).

---

## 📋 Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   A Spring Boot project (currently optimized for Maven-based `pom.xml` configurations)

---

## 🚀 How to Install and Use

You can run this tool in a few different ways depending on your workflow:

### Option 1: Run Globally via npm link (Recommended)

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/rifqinur11/generate-readme-spring.git
   cd generate-readme-spring
   ```

2. Link the package globally to create the `gen-readme` executable:
   ```bash
   npm link
   ```

3. Navigate to the root directory of your Spring Boot project and run:
   ```bash
   gen-readme
   ```

---

### Option 2: Run Directly with Node.js

If you do not want to install it globally, you can run the entry script directly:

1. Navigate to the root directory of your Spring Boot project:
   ```bash
   cd /path/to/your/spring-boot-project
   ```

2. Execute the script using `node` by pointing to the tool's path:
   ```bash
   node /path/to/generate-readme-spring/index.js
   ```

---

## 🖥️ Interactive Setup Flow

Once executed, the tool will perform a quick scan and display the detected environment details. It will then guide you through a brief interactive prompt:

```text
🔍 Memulai pemindaian project Spring Boot...
🤖 Terdeteksi: Project Maven | Java v17 | Spring Boot v3.2.2
📦 Terdeteksi 3 core libraries utama.

? Nama Project: my-awesome-api
? Jelaskan singkat aplikasi ini (1 kalimat): API Gateway untuk manajemen transaksi pengguna.
? Pilih Tipe Project: Service / API
? Berapa default port API-nya? 8080
? Apa base path url-nya? (misal: /api/v1) /api/v1

🎉 Sukses! File README.md dengan daftar tabel library berhasil digenerate di: /path/to/your/spring-boot-project/README.md
```

---

## 📦 Supported Dependencies (Auto-Detected)

The tool currently scans and maps the following popular libraries automatically into your documentation:

| Category | Artifact ID / Keyword | Description |
| :--- | :--- | :--- |
| **Core / Web** | `spring-boot-starter-web` | REST API development with Spring MVC |
| **Core / Batch** | `spring-boot-starter-batch` | Large-scale batch data processing |
| **Messaging** | `spring-kafka`, `spring-boot-starter-amqp` | Apache Kafka or RabbitMQ integrations |
| **Database & ORM** | `spring-boot-starter-data-jpa`, `-mongodb` | SQL (JPA/Hibernate) or MongoDB integrations |
| **Database Drivers** | `postgresql`, `mysql-connector-j` | PostgreSQL or MySQL database drivers |
| **Utilities** | `lombok` | Code boilerplate reduction (getters, setters, builders) |
| **Security** | `spring-boot-starter-security` | Application authentication and authorization |
| **Monitoring** | `spring-boot-starter-actuator` | Production-ready health check and metrics endpoints |
| **Documentation** | `springdoc-openapi-starter-webmvc-ui` | Swagger UI & OpenAPI Specification generation |

*Note: For other starters, the generator will fallback to dynamically mapping them under the general "Spring Starter" category.*

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
