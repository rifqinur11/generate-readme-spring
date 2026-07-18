#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

// Fungsi untuk mengekstrak informasi dasar dan mendeteksi library penting dari pom.xml
function parsePomXml(content) {
    const artifactId = content.match(/<artifactId>([\s\S]*?)<\/artifactId>/)?.[1]?.trim();
    const javaVersion = content.match(/<java\.version>([\s\S]*?)<\/java\.version>|<maven\.compiler\.source>([\s\S]*?)<\/maven\.compiler\.source>/)?.[1]?.trim() || '17';
    const springVersion = content.match(/<version>([\s\S]*?)<\/version>/)?.[1]?.trim() || '3.x';

    // Regex untuk mengambil semua artifactId dari dependency yang ada
    const dependencyRegex = /<dependency>[\s\S]*?<artifactId>([\s\S]*?)<\/artifactId>[\s\S]*?<\/dependency>/g;
    let match;
    const dependencies = [];

    while ((match = dependencyRegex.exec(content)) !== null) {
        dependencies.push(match[1].trim());
    }

    // Mapping library penting untuk dimasukkan ke tabel
    const libraryMapping = {
        'spring-boot-starter-web': { name: 'Spring Web', category: 'Core / Web', desc: 'Membangun REST API menggunakan Spring MVC' },
        'spring-boot-starter-batch': { name: 'Spring Batch', category: 'Core / Batch', desc: 'Framework untuk pemrosesan data skala besar' },
        'spring-kafka': { name: 'Spring Kafka', category: 'Messaging', desc: 'Integrasi dengan Apache Kafka' },
        'spring-boot-starter-amqp': { name: 'Spring AMQP (RabbitMQ)', category: 'Messaging', desc: 'Integrasi dengan RabbitMQ broker' },
        'spring-boot-starter-data-jpa': { name: 'Spring Data JPA', category: 'Database', desc: 'Abstraksi ORM untuk akses database SQL' },
        'spring-boot-starter-data-mongodb': { name: 'Spring Data MongoDB', category: 'Database', desc: 'Akses database NoSQL MongoDB' },
        'postgresql': { name: 'PostgreSQL Driver', category: 'Database Driver', desc: 'Driver database PostgreSQL' },
        'mysql-connector-j': { name: 'MySQL Driver', category: 'Database Driver', desc: 'Driver database MySQL' },
        'lombok': { name: 'Project Lombok', category: 'Utility', desc: 'Otomatisasi Java boilerplate (getter, setter, log)' },
        'spring-boot-starter-security': { name: 'Spring Security', category: 'Security', desc: 'Autentikasi dan otorisasi aplikasi' },
        'spring-boot-starter-actuator': { name: 'Spring Boot Actuator', category: 'Monitoring', desc: 'Menyediakan healthcheck dan metrics production-ready' },
        'springdoc-openapi-starter-webmvc-ui': { name: 'Springdoc OpenAPI (Swagger)', category: 'Documentation', desc: 'Otomatisasi dokumentasi Open API / Swagger UI' }
    };

    const detectedLibraries = [];
    dependencies.forEach(dep => {
        // Cek apakah artifactId terdaftar atau mengandung kata kunci tertentu
        if (libraryMapping[dep]) {
            detectedLibraries.push(libraryMapping[dep]);
        } else if (dep.includes('starter')) {
            // Fallback generic jika ada starter lain yang tidak terpetakan
            const cleanName = dep.replace('spring-boot-starter-', '').replace(/-/g, ' ');
            detectedLibraries.push({
                name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
                category: 'Spring Starter',
                desc: 'Library bawaan Spring Boot'
            });
        }
    });

    // Menghilangkan duplikasi library bawaan
    const uniqueLibraries = Array.from(new Set(detectedLibraries.map(JSON.stringify))).map(JSON.parse);

    return { name: artifactId, javaVersion, springVersion, tool: 'Maven', libraries: uniqueLibraries };
}

// Fungsi helper untuk generate HTML Table dari data library
function generateLibraryTable(libraries) {
    if (!libraries || libraries.length === 0) {
        return '<p><em>Tidak ada library eksternal utama yang terdeteksi secara otomatis.</em></p>';
    }

    let tableHtml = `
<table>
  <thead>
    <tr>
      <th align="left">Library Name</th>
      <th align="left">Category</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>`;

    libraries.forEach(lib => {
        tableHtml += `
    <tr>
      <td><strong>${lib.name}</strong></td>
      <td><code>${lib.category}</code></td>
      <td>${lib.desc}</td>
    </tr>`;
    });

    tableHtml += `
  </tbody>
</table>
`;
    return tableHtml;
}

async function main() {
    console.log("🔍 Memulai pemindaian project Spring Boot...");

    const cwd = process.cwd();
    let projectInfo = { name: path.basename(cwd), javaVersion: '17', springVersion: '3.x', tool: 'Unknown', libraries: [] };

    // Deteksi pom.xml (Maven)
    if (fs.existsSync(path.join(cwd, 'pom.xml'))) {
        const content = fs.readFileSync(path.join(cwd, 'pom.xml'), 'utf-8');
        projectInfo = parsePomXml(content);
    } else {
        console.log("⚠️ Peringatan: Saat ini fitur auto-detect library baru optimal untuk Maven (pom.xml). Menjalankan mode basic.");
    }

    console.log(`🤖 Terdeteksi: Project ${projectInfo.tool} | Java v${projectInfo.javaVersion} | Spring Boot v${projectInfo.springVersion}`);
    console.log(`📦 Terdeteksi ${projectInfo.libraries.length} core libraries utama.\n`);

    // INTERACTIVE PROMPT STAGE (Junior Friendly)
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Nama Project:',
            default: projectInfo.name
        },
        {
            type: 'input',
            name: 'description',
            message: 'Jelaskan singkat aplikasi ini (1 kalimat):',
            default: 'Service backend yang dibangun menggunakan Spring Boot.'
        },
        {
            type: 'list',
            name: 'projectType',
            message: 'Pilih Tipe Project:',
            choices: ['Service / API', 'Batch Job', 'Consumer / Worker']
        },
        {
            type: 'input',
            name: 'port',
            message: 'Berapa default port API-nya?',
            default: '8080',
            when: (ans) => ans.projectType === 'Service / API'
        },
        {
            type: 'input',
            name: 'basePath',
            message: 'Apa base path url-nya? (misal: /api/v1)',
            default: '/',
            when: (ans) => ans.projectType === 'Service / API'
        },
        {
            type: 'input',
            name: 'jobName',
            message: 'Apa nama Batch Job utamanya?',
            default: 'mySampleBatchJob',
            when: (ans) => ans.projectType === 'Batch Job'
        },
        {
            type: 'input',
            name: 'trigger',
            message: 'Bagaimana mekanisme triggernya? (misal: Cron/Scheduler, REST Endpoint)',
            default: 'Cron Schedule',
            when: (ans) => ans.projectType === 'Batch Job'
        },
        {
            type: 'input',
            name: 'broker',
            message: 'Apa Message Broker yang digunakan? (Kafka / RabbitMQ / SQS)',
            default: 'Apache Kafka',
            when: (ans) => ans.projectType === 'Consumer / Worker'
        },
        {
            type: 'input',
            name: 'topic',
            message: 'Apa nama Topic atau Queue yang di-consume? (pisahkan koma jika banyak)',
            default: 'my.event.topic.v1',
            when: (ans) => ans.projectType === 'Consumer / Worker'
        }
    ]);

    // Pembuatan Spesifikasi berdasarkan tipe aplikasi
    let specSection = '';
    if (answers.projectType === 'Service / API') {
        specSection = `### 🌐 API Service Details
*   **Default Port:** \`${answers.port}\`
*   **Base Path:** \`${answers.basePath}\`
*   **API Documentation:** \`http://localhost:${answers.port}${answers.basePath === '/' ? '' : answers.basePath}/swagger-ui.html\``;
    } else if (answers.projectType === 'Batch Job') {
        specSection = `### ⏱️ Batch Job Details
*   **Job Name:** \`${answers.jobName}\`
*   **Trigger Mechanism:** ${answers.trigger}`;
    } else if (answers.projectType === 'Consumer / Worker') {
        specSection = `### 📥 Consumer Details
*   **Message Broker:** ${answers.broker}
*   **Consumed Topic/Queue:** \`${answers.topic}\`
*   **Consumer Group ID:** \`${answers.projectName}-group\``;
    }

    // Generate HTML tabel dari data libraries yang ditangkap
    const libraryTableHtml = generateLibraryTable(projectInfo.libraries);

    const readmeTemplate = `# ${answers.projectName}

> ${answers.description}

---

## 🏗️ Technical Stack
*   **Language:** Java ${projectInfo.javaVersion}
*   **Framework:** Spring Boot v${projectInfo.springVersion}
*   **Build Tool:** ${projectInfo.tool}

### 📦 Core Libraries Used
Berikut adalah daftar dependency utama yang terdeteksi di dalam project ini:
${libraryTableHtml}
---

## ⚙️ Application Specifications
${specSection}

---

## 🚀 Getting Started

### Prerequisites
*   Java Development Kit (JDK) ${projectInfo.javaVersion}
*   Docker (Untuk keperluan database / broker lokal)

### Running Locally
1. Clone repositori ini dan masuk ke folder project.
2. Pastikan file konfigurasi lokal (\`application-local.yaml\`) sudah dikonfigurasi dengan benar.
3. Jalankan perintah berikut di terminal:
   \`\`\`bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   \`\`\`

---

## 🩺 Monitoring & Health Check
*   **Health Endpoint:** \`http://localhost:${answers.port || '8080'}/actuator/health\`
`;

    const outputPath = path.join(cwd, 'README.md');
    fs.writeFileSync(outputPath, readmeTemplate, 'utf-8');
    console.log(`\n🎉 Sukses! File README.md dengan daftar tabel library berhasil digenerate di: ${outputPath}`);
}

main().catch(err => console.error("Terjadi error saat men-generate README:", err));