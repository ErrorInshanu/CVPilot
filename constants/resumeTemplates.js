// constants/resumeTemplates.js
// All resume HTML templates live here.
// Add new templates below and register them in getTemplate().

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function buildBullets(description) {
    if (!description) return "";
    return description
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `<div class="bullet">${l.startsWith("•") ? l : "• " + l}</div>`)
        .join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1 — classic-clean
// Style: Image 1 (Daniel Meyer) — left name + inline italic title,
//        grey banner section headers, 2-col skills, Georgia serif
// ─────────────────────────────────────────────────────────────────────────────
function buildClassicClean(resume) {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";

    const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);
    const contactLine = contactParts.join(" &nbsp;|&nbsp; ");

    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">SUMMARY</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(exp.role || exp.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
                ${exp.location ? ` &nbsp;|&nbsp; ${escapeHtml(exp.location)}` : ""}
              </div>
            </div>
            <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}</div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">EDUCATION</div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(edu.institution || edu.school || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
                ${edu.location ? ` &nbsp;|&nbsp; ${escapeHtml(edu.location)}` : ""}
              </div>
            </div>
            <div class="entry-subtitle">${escapeHtml(edu.degree || "")}${edu.field ? `, ${escapeHtml(edu.field)}` : ""}</div>
            ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Skills (2 column) ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">SKILLS</div>
        <div class="skills-grid">
          ${resume.skills.map((s) => `<div class="skill-item">• ${escapeHtml(s.name)}</div>`).join("")}
        </div>
      </div>` : "";

    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROJECTS</div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(proj.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` • ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
            ${proj.url ? `<div class="entry-link">${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Certifications ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">CERTIFICATES</div>
        ${resume.certifications.map((cert) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(cert.name || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(cert.issueDate || "")}</div>
            </div>
            <div class="entry-subtitle">${escapeHtml(cert.issuer || cert.organization || "")}</div>
          </div>`).join("")}
      </div>` : "";

    // ── Languages ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">LANGUAGES</div>
        <div class="lang-row">
          ${resume.languages.map((l) => `
            <span class="lang-item"><strong>${escapeHtml(l.name)}</strong> — ${escapeHtml(l.proficiency || "")}</span>
          `).join('<span class="lang-sep"> &nbsp;|&nbsp; </span>')}
        </div>
      </div>` : "";

    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">ACHIEVEMENTS</div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(a.title || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
            ${a.description ? `<div class="entry-desc"><div class="bullet">${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">TRAINING & WORKSHOPS</div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(t.title || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
            ${t.organization ? `<div class="entry-subtitle">${escapeHtml(t.organization)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">INTERESTS</div>
        <div class="lang-row">
          ${resume.interests.map((i) => `<span class="lang-item">${escapeHtml(i.name)}</span>`).join('<span class="lang-sep"> &nbsp;|&nbsp; </span>')}
        </div>
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 32px 40px;
        line-height: 1.5;
      }
  
      /* ── Header ── */
      .header {
        margin-bottom: 16px;
        padding-bottom: 10px;
        border-bottom: 1.5px solid #1a1a1a;
      }
      .header-top {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 5px;
      }
      .header-name {
        font-size: 24px;
        font-weight: bold;
        color: #1a1a1a;
        letter-spacing: 0.5px;
      }
      .header-title {
        font-size: 13px;
        font-style: italic;
        color: #444;
      }
      .header-contact {
        font-size: 10px;
        color: #444;
      }
  
      /* ── Section ── */
      .section { margin-bottom: 14px; }
  
      .section-header {
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #1a1a1a;
        background: #f0f0f0;
        padding: 3px 6px;
        margin-bottom: 8px;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 11px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 9px; }
  
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
  
      .entry-title {
        font-size: 11.5px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .entry-subtitle {
        font-size: 10.5px;
        color: #555;
        font-style: italic;
        margin-top: 1px;
      }
      .entry-grade {
        font-size: 10px;
        color: #666;
        margin-top: 1px;
      }
      .entry-date {
        font-size: 10px;
        color: #555;
        white-space: nowrap;
        margin-left: 10px;
        padding-top: 2px;
        text-align: right;
      }
      .entry-desc { margin-top: 4px; }
      .bullet {
        font-size: 10.5px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 4px;
      }
      .entry-link {
        font-size: 10px;
        color: #2563eb;
        margin-top: 3px;
      }
  
      /* ── Skills 2-col grid ── */
      .skills-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3px 20px;
      }
      .skill-item {
        font-size: 10.5px;
        color: #333;
      }
  
      /* ── Languages / Interests ── */
      .lang-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      .lang-item { font-size: 10.5px; color: #333; }
      .lang-sep  { font-size: 10.5px; color: #999; }
    </style>
  </head>
  <body>
  
    <div class="header">
      <div class="header-top">
        <span class="header-name">${name}</span>
        ${jobTitle ? `<span class="header-title">${jobTitle}</span>` : ""}
      </div>
      <div class="header-contact">${contactLine}</div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2 — classic-bold  (your original template)
// Style: Centered name, bold caps headers, full divider line
// ─────────────────────────────────────────────────────────────────────────────
function buildClassicBold(resume) {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";

    const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);
    const contactLine = contactParts.join("  •  ");

    const summarySection = summary ? `
      <div class="section">
        <div class="section-title">PROFESSIONAL SUMMARY</div>
        <div class="section-divider"></div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-title">WORK EXPERIENCE</div>
        <div class="section-divider"></div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(exp.role || exp.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}${exp.location ? ` • ${escapeHtml(exp.location)}` : ""}</div>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-title">EDUCATION</div>
        <div class="section-divider"></div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</div>
                <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}${edu.board ? ` • ${escapeHtml(edu.board)}` : ""}</div>
                ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
              </div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-title">SKILLS</div>
        <div class="section-divider"></div>
        <div class="skills-wrap">
          ${resume.skills.map((s) => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join("")}
        </div>
      </div>` : "";

    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-title">PROJECTS</div>
        <div class="section-divider"></div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(proj.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` • ${escapeHtml(proj.technologies)}` : ""}</div>
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
            ${proj.url ? `<div class="entry-link">${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-title">CERTIFICATIONS</div>
        <div class="section-divider"></div>
        ${resume.certifications.map((cert) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(cert.name || "")}</div>
                <div class="entry-subtitle">${escapeHtml(cert.issuer || cert.organization || "")}</div>
              </div>
              <div class="entry-date">${escapeHtml(cert.issueDate || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-title">LANGUAGES</div>
        <div class="section-divider"></div>
        <div class="skills-wrap">
          ${resume.languages.map((l) => `<span class="skill-tag">${escapeHtml(l.name)} <span class="lang-level">(${escapeHtml(l.proficiency || "")})</span></span>`).join("")}
        </div>
      </div>` : "";

    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-title">ACHIEVEMENTS</div>
        <div class="section-divider"></div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(a.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(a.issuer || a.organization || "")}</div>
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="entry-desc"><div class="bullet">${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-title">TRAINING & WORKSHOPS</div>
        <div class="section-divider"></div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(t.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(t.organization || "")}</div>
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-title">INTERESTS</div>
        <div class="section-divider"></div>
        <div class="skills-wrap">
          ${resume.interests.map((i) => `<span class="skill-tag">${escapeHtml(i.name)}</span>`).join("")}
        </div>
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 36px 44px;
        line-height: 1.5;
      }
      .header {
        text-align: center;
        margin-bottom: 18px;
        padding-bottom: 14px;
        border-bottom: 2px solid #1a1a1a;
      }
      .header-name {
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: #1a1a1a;
        margin-bottom: 4px;
      }
      .header-title {
        font-size: 12px;
        color: #555;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .header-contact { font-size: 10px; color: #444; }
      .section { margin-bottom: 16px; }
      .section-title {
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #1a1a1a;
        margin-bottom: 4px;
      }
      .section-divider {
        height: 1.5px;
        background-color: #1a1a1a;
        margin-bottom: 10px;
      }
      .summary-text { font-size: 11px; color: #333; line-height: 1.6; }
      .entry { margin-bottom: 10px; }
      .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
      .entry-left { flex: 1; }
      .entry-title { font-size: 12px; font-weight: bold; color: #1a1a1a; }
      .entry-subtitle { font-size: 10.5px; color: #555; font-style: italic; margin-top: 1px; }
      .entry-grade { font-size: 10px; color: #666; margin-top: 1px; }
      .entry-date { font-size: 10px; color: #555; white-space: nowrap; margin-left: 12px; padding-top: 2px; }
      .entry-desc { margin-top: 5px; }
      .bullet { font-size: 10.5px; color: #333; margin-bottom: 2px; padding-left: 4px; }
      .entry-link { font-size: 10px; color: #2563eb; margin-top: 3px; }
      .skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
      .skill-tag {
        font-size: 10px; color: #333;
        border: 1px solid #ccc; border-radius: 3px;
        padding: 2px 8px; background: #f9f9f9;
      }
      .lang-level { color: #777; font-size: 9px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="header-name">${name}</div>
      ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
      <div class="header-contact">${contactLine}</div>
    </div>
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  </body>
  </html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3 — classic-pro
// Style: Image 3 (Ahmed Hassan) — bold caps headers + full underline,
//        dashes for bullets, inline pipe skills, company bold + inline role
// ─────────────────────────────────────────────────────────────────────────────
function buildClassicPro(resume) {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";

    const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);
    const contactLine = contactParts.join(" &nbsp;|&nbsp; ");

    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">SUMMARY</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(exp.company || exp.companyName || "")},</span>
                <span class="entry-role"> ${escapeHtml(exp.role || exp.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
                ${exp.location ? `<br/>${escapeHtml(exp.location)}` : ""}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${exp.description.split("\n").filter(l => l.trim()).map(l => `<div class="dash-bullet">- ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">EDUCATION</div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(edu.degree || "")}${edu.field ? `, ${escapeHtml(edu.field)}` : ""},</span>
                <span class="entry-role"> ${escapeHtml(edu.institution || edu.school || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
                ${edu.location ? `<br/>${escapeHtml(edu.location)}` : ""}
              </div>
            </div>
            ${edu.grade ? `<div class="dash-bullet">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Skills (inline pipe) ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">SKILLS</div>
        <p class="pipe-line">${resume.skills.map(s => escapeHtml(s.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";

    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROJECTS</div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(proj.title || "")}</span>
                ${proj.role ? `<span class="entry-role">, ${escapeHtml(proj.role)}</span>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.technologies ? `<div class="dash-bullet">Technologies: ${escapeHtml(proj.technologies)}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${proj.description.split("\n").filter(l => l.trim()).map(l => `<div class="dash-bullet">- ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
            ${proj.url ? `<div class="dash-bullet">URL: ${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Certifications (inline pipe) ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">CERTIFICATIONS</div>
        <p class="pipe-line">${resume.certifications.map(c => escapeHtml(c.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";

    // ── Languages (inline pipe) ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">LANGUAGES</div>
        <p class="pipe-line">${resume.languages.map(l => `<strong>${escapeHtml(l.name)}</strong>: ${escapeHtml(l.proficiency || "")}`).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";

    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">ACHIEVEMENTS</div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(a.title || "")}</span>
                ${a.issuer ? `<span class="entry-role">, ${escapeHtml(a.issuer)}</span>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="dash-bullet">- ${escapeHtml(a.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">TRAINING & WORKSHOPS</div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(t.title || "")}</span>
                ${t.organization ? `<span class="entry-role">, ${escapeHtml(t.organization)}</span>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";

    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">INTERESTS</div>
        <p class="pipe-line">${resume.interests.map(i => escapeHtml(i.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 32px 40px;
        line-height: 1.5;
      }
  
      /* ── Header ── */
      .header {
        margin-bottom: 14px;
        padding-bottom: 8px;
      }
      .header-top {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 4px;
      }
      .header-name {
        font-size: 22px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .header-title {
        font-size: 13px;
        font-style: italic;
        color: #444;
      }
      .header-contact {
        font-size: 10px;
        color: #444;
        margin-bottom: 8px;
      }
      .header-divider {
        height: 1.5px;
        background: #1a1a1a;
      }
  
      /* ── Section ── */
      .section { margin-bottom: 13px; }
  
      .section-header {
        font-size: 10.5px;
        font-weight: bold;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #1a1a1a;
        border-bottom: 1.5px solid #1a1a1a;
        padding-bottom: 2px;
        margin-bottom: 7px;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 11px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 8px; }
  
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
  
      .entry-company {
        font-size: 11.5px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .entry-role {
        font-size: 11px;
        font-style: italic;
        color: #444;
      }
      .entry-date {
        font-size: 10px;
        color: #555;
        white-space: nowrap;
        margin-left: 10px;
        text-align: right;
        padding-top: 2px;
      }
      .entry-desc { margin-top: 3px; }
      .dash-bullet {
        font-size: 10.5px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 6px;
      }
  
      /* ── Pipe line (skills, languages, certs) ── */
      .pipe-line {
        font-size: 10.5px;
        color: #333;
        line-height: 1.8;
      }
    </style>
  </head>
  <body>
  
    <div class="header">
      <div class="header-top">
        <span class="header-name">${name}</span>
        ${jobTitle ? `<span class="header-title">${jobTitle}</span>` : ""}
      </div>
      <div class="header-contact">${contactLine}</div>
      <div class="header-divider"></div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
}
// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4 — classic-compact
// Style: Image 5 (Lena Hoffmann) — centered name, icons in contact,
//        bold caps + underline headers, dash bullets, pipe skills, dense layout
// ─────────────────────────────────────────────────────────────────────────────
function buildClassicCompact(resume) {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";

    // contact with icons
    const contactParts = [
        location ? `&#9679; ${location}` : "",
        email ? `&#9993; ${email}` : "",
        phone ? `&#9742; ${phone}` : "",
        linkedin ? `&#128279; ${linkedin}` : "",
        github ? `&#128279; ${github}` : "",
        website ? `&#128279; ${website}` : "",
    ].filter(Boolean);
    const contactLine = contactParts.join(" &nbsp;&nbsp; ");

    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">SUMMARY</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(exp.company || exp.companyName || "")},</span>
                <span class="entry-role"> ${escapeHtml(exp.role || exp.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
                ${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${exp.description.split("\n").filter(l => l.trim()).map(l => `<div class="dash-bullet">- ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">EDUCATION</div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(edu.institution || edu.school || "")},</span>
                <span class="entry-role"> ${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
                ${edu.location ? ` | ${escapeHtml(edu.location)}` : ""}
              </div>
            </div>
            ${edu.grade ? `<div class="dash-bullet">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Skills (inline pipe, multiline) ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">SKILLS</div>
        <p class="pipe-line">${resume.skills.map(s => escapeHtml(s.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";

    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROJECTS</div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(proj.title || "")}</span>
                ${proj.role ? `<span class="entry-role">, ${escapeHtml(proj.role)}</span>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.technologies ? `<div class="dash-bullet">Technologies: ${escapeHtml(proj.technologies)}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${proj.description.split("\n").filter(l => l.trim()).map(l => `<div class="dash-bullet">- ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
            ${proj.url ? `<div class="dash-bullet">URL: ${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Certifications (pipe) ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">CERTIFICATIONS</div>
        <p class="pipe-line">${resume.certifications.map(c => escapeHtml(c.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";

    // ── Languages ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">LANGUAGES</div>
        <p class="pipe-line">${resume.languages.map(l => `<strong>${escapeHtml(l.name)}</strong> (${escapeHtml(l.proficiency || "")})`).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";

    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">ACHIEVEMENTS</div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(a.title || "")}</span>
                ${a.issuer ? `<span class="entry-role">, ${escapeHtml(a.issuer)}</span>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="dash-bullet">- ${escapeHtml(a.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">TRAINING & WORKSHOPS</div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(t.title || "")}</span>
                ${t.organization ? `<span class="entry-role">, ${escapeHtml(t.organization)}</span>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";

    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">INTERESTS</div>
        <p class="pipe-line">${resume.interests.map(i => escapeHtml(i.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 10.5px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 28px 36px;
        line-height: 1.4;
      }
  
      /* ── Header ── */
      .header {
        text-align: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
      }
      .header-name {
        font-size: 22px;
        font-weight: bold;
        color: #1a1a1a;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }
      .header-title {
        font-size: 11px;
        font-style: italic;
        color: #555;
        margin-bottom: 5px;
      }
      .header-contact {
        font-size: 9.5px;
        color: #444;
        margin-bottom: 8px;
      }
      .header-divider {
        height: 1.5px;
        background: #1a1a1a;
      }
  
      /* ── Section ── */
      .section { margin-bottom: 11px; }
  
      .section-header {
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #1a1a1a;
        border-bottom: 1.5px solid #1a1a1a;
        padding-bottom: 2px;
        margin-bottom: 6px;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 10.5px;
        color: #333;
        line-height: 1.5;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 6px; }
  
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
  
      .entry-company {
        font-size: 11px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .entry-role {
        font-size: 10.5px;
        font-style: italic;
        color: #444;
      }
      .entry-date {
        font-size: 9.5px;
        color: #555;
        white-space: nowrap;
        margin-left: 10px;
        text-align: right;
        padding-top: 1px;
      }
      .entry-desc { margin-top: 2px; }
      .dash-bullet {
        font-size: 10px;
        color: #333;
        margin-bottom: 1px;
        padding-left: 6px;
      }
  
      /* ── Pipe line ── */
      .pipe-line {
        font-size: 10px;
        color: #333;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
  
    <div class="header">
      <div class="header-name">${name}</div>
      ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
      <div class="header-contact">${contactLine}</div>
      <div class="header-divider"></div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5 — classic-ats
// Style: Image 2 (James White) — centered name, title-case headers,
//        simple underline, bullet skills single col, zero decoration, pure ATS
// ─────────────────────────────────────────────────────────────────────────────
function buildClassicAts(resume) {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";

    const contactParts = [location, email, phone, linkedin, github, website].filter(Boolean);
    const contactLine = contactParts.join(" | ");

    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">Summary</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">Professional Experience</div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(exp.role || exp.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
                ${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
              </div>
            </div>
            <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}</div>
            ${exp.description ? `<div class="entry-desc">${exp.description.split("\n").filter(l => l.trim()).map(l => `<div class="bullet">• ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">Education</div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
                ${edu.location ? ` | ${escapeHtml(edu.location)}` : ""}
              </div>
            </div>
            <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}</div>
            ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Skills (single col bullets) ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">Skills</div>
        <div class="skills-col">
          ${resume.skills.map(s => `<div class="bullet">• ${escapeHtml(s.name)}</div>`).join("")}
        </div>
      </div>` : "";

    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">Projects</div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(proj.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` • ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${proj.description.split("\n").filter(l => l.trim()).map(l => `<div class="bullet">• ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
            ${proj.url ? `<div class="entry-subtitle">${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Certifications ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">Certificates</div>
        ${resume.certifications.map((cert) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(cert.name || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(cert.issueDate || "")}</div>
            </div>
            <div class="entry-subtitle">${escapeHtml(cert.issuer || cert.organization || "")}</div>
          </div>`).join("")}
      </div>` : "";

    // ── Languages ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">Languages</div>
        <div class="skills-col">
          ${resume.languages.map(l => `<div class="bullet">• ${escapeHtml(l.name)}${l.proficiency ? ` — ${escapeHtml(l.proficiency)}` : ""}</div>`).join("")}
        </div>
      </div>` : "";

    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">Achievements</div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(a.title || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
            ${a.description ? `<div class="bullet">• ${escapeHtml(a.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">Training & Workshops</div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(t.title || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
            ${t.organization ? `<div class="entry-subtitle">${escapeHtml(t.organization)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">Interests</div>
        <div class="skills-col">
          ${resume.interests.map(i => `<div class="bullet">• ${escapeHtml(i.name)}</div>`).join("")}
        </div>
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 32px 40px;
        line-height: 1.5;
      }
  
      /* ── Header ── */
      .header {
        text-align: center;
        margin-bottom: 16px;
      }
      .header-name {
        font-size: 24px;
        font-weight: bold;
        color: #1a1a1a;
        margin-bottom: 3px;
      }
      .header-title {
        font-size: 12px;
        font-style: italic;
        color: #555;
        margin-bottom: 5px;
      }
      .header-contact {
        font-size: 10px;
        color: #444;
      }
  
      /* ── Section ── */
      .section { margin-bottom: 14px; }
  
      .section-header {
        font-size: 12px;
        font-weight: bold;
        color: #1a1a1a;
        border-bottom: 1px solid #1a1a1a;
        padding-bottom: 2px;
        margin-bottom: 8px;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 11px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 9px; }
  
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
  
      .entry-title {
        font-size: 11.5px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .entry-subtitle {
        font-size: 10.5px;
        font-style: italic;
        color: #555;
        margin-top: 1px;
      }
      .entry-grade {
        font-size: 10px;
        color: #666;
        margin-top: 1px;
      }
      .entry-date {
        font-size: 10px;
        color: #555;
        white-space: nowrap;
        margin-left: 10px;
        padding-top: 2px;
        text-align: right;
      }
      .entry-desc { margin-top: 4px; }
      .bullet {
        font-size: 10.5px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 4px;
      }
  
      /* ── Skills single col ── */
      .skills-col { }
    </style>
  </head>
  <body>
  
    <div class="header">
      <div class="header-name">${name}</div>
      ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
      <div class="header-contact">${contactLine}</div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 6 — modern-executive
// Style: Concept 1 (MBA/Consulting) — dark sidebar, centered header,
//        rounded square photo, color picker support
// ─────────────────────────────────────────────────────────────────────────────
function buildModernExecutive(resume, themeColor = "#1E3A5F") {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";
    const photo = p.photo || "";

    // Initials for avatar fallback
    const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

    // ── Sidebar Sections ──
    const contactSection = `
      <div class="sidebar-section">
        <div class="sidebar-title">CONTACT</div>
        ${email ? `<div class="sidebar-item">✉ ${email}</div>` : ""}
        ${phone ? `<div class="sidebar-item">✆ ${phone}</div>` : ""}
        ${location ? `<div class="sidebar-item">⚲ ${location}</div>` : ""}
        ${linkedin ? `<div class="sidebar-item">in ${linkedin}</div>` : ""}
        ${github ? `<div class="sidebar-item">⌥ ${github}</div>` : ""}
        ${website ? `<div class="sidebar-item">⊕ ${website}</div>` : ""}
      </div>`;

    const skillsSidebar = resume.skills?.length > 0 ? `
      <div class="sidebar-section">
        <div class="sidebar-title">SKILLS</div>
        ${resume.skills.map(s => `
          <div class="skill-item">
            <div class="skill-name">${escapeHtml(s.name)}</div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" style="width:${s.level === 'expert' ? '90%' : s.level === 'intermediate' ? '65%' : '40%'}"></div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const languagesSidebar = resume.languages?.length > 0 ? `
      <div class="sidebar-section">
        <div class="sidebar-title">LANGUAGES</div>
        ${resume.languages.map(l => `
          <div class="sidebar-item"><strong>${escapeHtml(l.name)}</strong> — ${escapeHtml(l.proficiency || "")}</div>
        `).join("")}
      </div>` : "";

    const certsSidebar = resume.certifications?.length > 0 ? `
      <div class="sidebar-section">
        <div class="sidebar-title">CERTIFICATIONS</div>
        ${resume.certifications.map(c => `
          <div class="sidebar-item">${escapeHtml(c.name)}</div>
          ${c.issuer ? `<div class="sidebar-sub">${escapeHtml(c.issuer)}</div>` : ""}
        `).join("")}
      </div>` : "";

    const interestsSidebar = resume.interests?.length > 0 ? `
      <div class="sidebar-section">
        <div class="sidebar-title">INTERESTS</div>
        <div class="interests-wrap">
          ${resume.interests.map(i => `<span class="interest-chip">${escapeHtml(i.name)}</span>`).join("")}
        </div>
      </div>` : "";

    // ── Main Sections ──
    const summarySection = summary ? `
      <div class="main-section">
        <div class="main-title">PROFESSIONAL SUMMARY</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    const experienceSection = resume.experience?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience.map(exp => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(exp.role || exp.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}</div>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const educationSection = resume.education?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">EDUCATION</div>
        ${resume.education.map(edu => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</div>
                <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}</div>
                ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
              </div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const projectsSection = resume.projects?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">PROJECTS</div>
        ${resume.projects.map(proj => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(proj.title || "")}</div>
                ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` · ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">ACHIEVEMENTS</div>
        ${resume.achievements.map(a => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(a.title || "")}</div>
                ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="entry-desc"><div class="bullet">• ${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const trainingSection = resume.training?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">TRAINING & WORKSHOPS</div>
        ${resume.training.map(t => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(t.title || "")}</div>
                ${t.organization ? `<div class="entry-subtitle">${escapeHtml(t.organization)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        display: flex;
        min-height: 100vh;
      }
  
      /* ── Sidebar ── */
      .sidebar {
        width: 220px;
        min-width: 220px;
        background: ${themeColor};
        padding: 24px 16px;
        display: flex;
        flex-direction: column;
        gap: 0;
      }
  
      /* ── Photo ── */
      .photo-wrap {
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
      }
      .photo-box {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .photo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .photo-initials {
        font-size: 22px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: 1px;
      }
  
      /* ── Sidebar Name ── */
      .sidebar-name {
        text-align: center;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 4px;
        line-height: 1.3;
      }
      .sidebar-title {
        text-align: center;
        font-size: 9px;
        color: rgba(255,255,255,0.7);
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 16px;
      }
  
      /* ── Sidebar Sections ── */
      .sidebar-section {
        margin-bottom: 14px;
        border-top: 1px solid rgba(255,255,255,0.15);
        padding-top: 10px;
      }
      .sidebar-section .sidebar-title {
        text-align: left;
        font-size: 8.5px;
        font-weight: 800;
        color: rgba(255,255,255,0.6);
        letter-spacing: 1.5px;
        margin-bottom: 6px;
      }
      .sidebar-item {
        font-size: 9.5px;
        color: rgba(255,255,255,0.85);
        margin-bottom: 4px;
        line-height: 1.4;
        word-break: break-all;
      }
      .sidebar-sub {
        font-size: 8.5px;
        color: rgba(255,255,255,0.55);
        margin-bottom: 6px;
        margin-top: -2px;
      }
  
      /* ── Skill Bars ── */
      .skill-item { margin-bottom: 6px; }
      .skill-name {
        font-size: 9.5px;
        color: rgba(255,255,255,0.85);
        margin-bottom: 2px;
      }
      .skill-bar-bg {
        height: 3px;
        background: rgba(255,255,255,0.2);
        border-radius: 2px;
        overflow: hidden;
      }
      .skill-bar-fill {
        height: 100%;
        background: rgba(255,255,255,0.8);
        border-radius: 2px;
      }
  
      /* ── Interests ── */
      .interests-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .interest-chip {
        font-size: 8.5px;
        color: rgba(255,255,255,0.85);
        background: rgba(255,255,255,0.12);
        border-radius: 3px;
        padding: 2px 6px;
        border: 1px solid rgba(255,255,255,0.2);
      }
  
      /* ── Main Content ── */
      .main {
        flex: 1;
        padding: 24px 20px;
        display: flex;
        flex-direction: column;
        gap: 0;
      }
  
      /* ── Main Header ── */
      .main-header {
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid ${themeColor};
      }
      .main-name {
        font-size: 24px;
        font-weight: 900;
        color: ${themeColor};
        letter-spacing: 0.5px;
        margin-bottom: 3px;
      }
      .main-job-title {
        font-size: 12px;
        color: #555;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
  
      /* ── Main Sections ── */
      .main-section { margin-bottom: 14px; }
  
      .main-title {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${themeColor};
        border-bottom: 1.5px solid ${themeColor};
        padding-bottom: 3px;
        margin-bottom: 8px;
      }
  
      .summary-text {
        font-size: 10.5px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 9px; }
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
      .entry-title {
        font-size: 11px;
        font-weight: 700;
        color: #1a1a1a;
      }
      .entry-subtitle {
        font-size: 10px;
        color: #555;
        font-style: italic;
        margin-top: 1px;
      }
      .entry-grade {
        font-size: 9.5px;
        color: #666;
        margin-top: 1px;
      }
      .entry-date {
        font-size: 9.5px;
        color: #666;
        white-space: nowrap;
        margin-left: 8px;
        padding-top: 1px;
        text-align: right;
      }
      .entry-desc { margin-top: 4px; }
      .bullet {
        font-size: 10px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 4px;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
  
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="photo-wrap">
        <div class="photo-box">
          ${photo
            ? `<img src="${photo}" class="photo-img" />`
            : `<span class="photo-initials">${initials}</span>`
        }
        </div>
      </div>
      <div class="sidebar-name">${name}</div>
      ${jobTitle ? `<div class="sidebar-title">${jobTitle}</div>` : ""}
  
      ${contactSection}
      ${skillsSidebar}
      ${languagesSidebar}
      ${certsSidebar}
      ${interestsSidebar}
    </div>
  
    <!-- Main Content -->
    <div class="main">
      <div class="main-header">
        <div class="main-name">${name}</div>
        ${jobTitle ? `<div class="main-job-title">${jobTitle}</div>` : ""}
      </div>
  
      ${summarySection}
      ${experienceSection}
      ${educationSection}
      ${projectsSection}
      ${achievementsSection}
      ${trainingSection}
    </div>
  
  </body>
  </html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 7 — modern-analytical
// Style: Concept 2 (Finance/Data) — left header, two-column,
//        skill percentage bars, dense data presentation
// ─────────────────────────────────────────────────────────────────────────────
function buildModernAnalytical(resume, themeColor = "#1E3A5F") {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";
    const photo = p.photo || "";

    const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

    const contactParts = [
        email ? `✉ ${email}` : "",
        phone ? `✆ ${phone}` : "",
        location ? `⚲ ${location}` : "",
        linkedin ? `in ${linkedin}` : "",
        github ? `⌥ ${github}` : "",
        website ? `⊕ ${website}` : "",
    ].filter(Boolean);

    // ── Left Column ──
    const skillsLeft = resume.skills?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">SKILLS</div>
        ${resume.skills.map(s => `
          <div class="skill-item">
            <div class="skill-row">
              <span class="skill-name">${escapeHtml(s.name)}</span>
              <span class="skill-pct">${s.level === 'expert' ? '90%' : s.level === 'intermediate' ? '65%' : '40%'}</span>
            </div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" style="width:${s.level === 'expert' ? '90%' : s.level === 'intermediate' ? '65%' : '40%'}; background:${themeColor};"></div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const languagesLeft = resume.languages?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">LANGUAGES</div>
        ${resume.languages.map(l => `
          <div class="col-item"><strong>${escapeHtml(l.name)}</strong> — ${escapeHtml(l.proficiency || "")}</div>
        `).join("")}
      </div>` : "";

    const certsLeft = resume.certifications?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">CERTIFICATIONS</div>
        ${resume.certifications.map(c => `
          <div class="col-item">${escapeHtml(c.name)}</div>
          ${c.issuer ? `<div class="col-sub">${escapeHtml(c.issuer)}</div>` : ""}
        `).join("")}
      </div>` : "";

    const interestsLeft = resume.interests?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">INTERESTS</div>
        <div class="interests-wrap">
          ${resume.interests.map(i => `<span class="interest-chip">${escapeHtml(i.name)}</span>`).join("")}
        </div>
      </div>` : "";

    // ── Right Column ──
    const summaryRight = summary ? `
      <div class="main-section">
        <div class="main-title">PROFILE</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    const experienceRight = resume.experience?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience.map(exp => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(exp.role || exp.title || "")}</span>
                <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}</div>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const educationRight = resume.education?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">EDUCATION</div>
        ${resume.education.map(edu => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</span>
                <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}</div>
                ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
              </div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const projectsRight = resume.projects?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">PROJECTS</div>
        ${resume.projects.map(proj => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(proj.title || "")}</span>
                ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` · ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const achievementsRight = resume.achievements?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">ACHIEVEMENTS</div>
        ${resume.achievements.map(a => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(a.title || "")}</span>
                ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="entry-desc"><div class="bullet">• ${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
      }
  
      /* ── Header ── */
      .header {
        background: ${themeColor};
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .photo-box {
        width: 72px;
        height: 72px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.4);
        background: rgba(255,255,255,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .photo-img { width:100%; height:100%; object-fit:cover; }
      .photo-initials {
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
      }
      .header-info { flex: 1; }
      .header-name {
        font-size: 22px;
        font-weight: 900;
        color: #ffffff;
        margin-bottom: 3px;
      }
      .header-title {
        font-size: 11px;
        color: rgba(255,255,255,0.8);
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .header-contact {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .contact-item {
        font-size: 9px;
        color: rgba(255,255,255,0.75);
      }
  
      /* ── Body ── */
      .body {
        display: flex;
        gap: 0;
      }
  
      /* ── Left Column ── */
      .left-col {
        width: 200px;
        min-width: 200px;
        background: #f5f5f5;
        padding: 16px 14px;
        border-right: 1px solid #e0e0e0;
      }
      .col-section { margin-bottom: 14px; }
      .col-title {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${themeColor};
        border-bottom: 1.5px solid ${themeColor};
        padding-bottom: 3px;
        margin-bottom: 7px;
      }
      .col-item {
        font-size: 9.5px;
        color: #333;
        margin-bottom: 3px;
        line-height: 1.4;
      }
      .col-sub {
        font-size: 8.5px;
        color: #777;
        margin-bottom: 5px;
        margin-top: -1px;
      }
  
      /* ── Skill Bars ── */
      .skill-item { margin-bottom: 7px; }
      .skill-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2px;
      }
      .skill-name { font-size: 9.5px; color: #333; }
      .skill-pct { font-size: 9px; color: #777; }
      .skill-bar-bg {
        height: 3px;
        background: #ddd;
        border-radius: 2px;
        overflow: hidden;
      }
      .skill-bar-fill {
        height: 100%;
        border-radius: 2px;
      }
  
      /* ── Interests ── */
      .interests-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
      .interest-chip {
        font-size: 8.5px;
        color: ${themeColor};
        background: rgba(0,0,0,0.05);
        border-radius: 3px;
        padding: 2px 6px;
        border: 1px solid ${themeColor}40;
      }
  
      /* ── Right Column ── */
      .right-col { flex: 1; padding: 16px 18px; }
      .main-section { margin-bottom: 13px; }
      .main-title {
        font-size: 9.5px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${themeColor};
        border-bottom: 1.5px solid ${themeColor};
        padding-bottom: 3px;
        margin-bottom: 8px;
      }
      .summary-text {
        font-size: 10.5px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 8px; }
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
      .entry-title {
        font-size: 11px;
        font-weight: 700;
        color: #1a1a1a;
      }
      .entry-subtitle {
        font-size: 10px;
        color: #555;
        font-style: italic;
        margin-top: 1px;
      }
      .entry-grade { font-size: 9.5px; color: #666; margin-top: 1px; }
      .entry-date {
        font-size: 9.5px;
        color: #666;
        white-space: nowrap;
        margin-left: 8px;
        text-align: right;
      }
      .entry-desc { margin-top: 4px; }
      .bullet {
        font-size: 10px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 4px;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
  
    <!-- Header -->
    <div class="header">
    ${photo ? `<div class="photo-box">
      <img src="${photo}" class="photo-img" />
    </div>` : ""}
      <div class="header-info">
        <div class="header-name">${name}</div>
        ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
        <div class="header-contact">
          ${contactParts.map(c => `<span class="contact-item">${c}</span>`).join("")}
        </div>
      </div>
    </div>
  
    <!-- Body -->
    <div class="body">
      <!-- Left Column -->
      <div class="left-col">
        ${skillsLeft}
        ${languagesLeft}
        ${certsLeft}
        ${interestsLeft}
      </div>
  
      <!-- Right Column -->
      <div class="right-col">
        ${summaryRight}
        ${experienceRight}
        ${educationRight}
        ${projectsRight}
        ${achievementsRight}
      </div>
    </div>
  
  </body>
  </html>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 8 — modern-dynamic
// Style: Concept 3 (Marketing/Creative Tech) — asymmetrical two-column,
//        bold name, dark top band, projects focused
// ─────────────────────────────────────────────────────────────────────────────
function buildModernDynamic(resume, themeColor = "#1E3A5F") {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";
    const photo = p.photo || "";

    const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

    // ── Left Column ──
    const contactLeft = `
      <div class="col-section">
        <div class="col-title">CONTACT</div>
        ${email ? `<div class="col-item">✉ ${email}</div>` : ""}
        ${phone ? `<div class="col-item">✆ ${phone}</div>` : ""}
        ${location ? `<div class="col-item">⚲ ${location}</div>` : ""}
        ${linkedin ? `<div class="col-item">in ${linkedin}</div>` : ""}
        ${github ? `<div class="col-item">⌥ ${github}</div>` : ""}
        ${website ? `<div class="col-item">⊕ ${website}</div>` : ""}
      </div>`;

    const skillsLeft = resume.skills?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">SKILLS</div>
        ${resume.skills.map(s => `<div class="col-item">▸ ${escapeHtml(s.name)}</div>`).join("")}
      </div>` : "";

    const languagesLeft = resume.languages?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">LANGUAGES</div>
        ${resume.languages.map(l => `
          <div class="col-item"><strong>${escapeHtml(l.name)}</strong></div>
          <div class="col-sub">${escapeHtml(l.proficiency || "")}</div>
        `).join("")}
      </div>` : "";

    const certsLeft = resume.certifications?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">CERTIFICATIONS</div>
        ${resume.certifications.map(c => `
          <div class="col-item">${escapeHtml(c.name)}</div>
          ${c.issuer ? `<div class="col-sub">${escapeHtml(c.issuer)}</div>` : ""}
        `).join("")}
      </div>` : "";

    const interestsLeft = resume.interests?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">INTERESTS</div>
        ${resume.interests.map(i => `<div class="col-item">▸ ${escapeHtml(i.name)}</div>`).join("")}
      </div>` : "";

    // ── Right Column ──
    const summaryRight = summary ? `
      <div class="main-section">
        <div class="main-title">ABOUT ME</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    const experienceRight = resume.experience?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">EXPERIENCE</div>
        ${resume.experience.map(exp => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(exp.company || exp.companyName || "")}</span>
                <span class="entry-role">, ${escapeHtml(exp.role || exp.title || "")}</span>
                ${exp.location ? `<div class="entry-location">${escapeHtml(exp.location)}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const educationRight = resume.education?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">EDUCATION</div>
        ${resume.education.map(edu => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(edu.institution || edu.school || "")}</span>
                <div class="entry-role-block">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</div>
                ${edu.grade ? `<div class="entry-location">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
              </div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const projectsRight = resume.projects?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">BRAND PROJECTS</div>
        ${resume.projects.map(proj => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(proj.title || "")}</span>
                ${proj.role || proj.technologies ? `<div class="entry-role-block">${escapeHtml(proj.role || "")}${proj.technologies ? ` · ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const achievementsRight = resume.achievements?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">ACHIEVEMENTS</div>
        ${resume.achievements.map(a => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(a.title || "")}</span>
                ${a.issuer ? `<div class="entry-location">${escapeHtml(a.issuer)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="entry-desc"><div class="bullet">• ${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Georgia', serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
  
      /* ── Top Band ── */
      .top-band {
        background: ${themeColor};
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .photo-box {
        width: 68px;
        height: 68px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.4);
        background: rgba(255,255,255,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .photo-img { width:100%; height:100%; object-fit:cover; }
      .photo-initials {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
      }
      .band-name {
        font-size: 26px;
        font-weight: 900;
        color: #ffffff;
        letter-spacing: 0.5px;
        line-height: 1.1;
      }
      .band-title {
        font-size: 10px;
        color: rgba(255,255,255,0.75);
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-top: 4px;
      }
  
      /* ── Body ── */
      .body {
        display: flex;
        flex: 1;
      }
  
      /* ── Left Column ── */
      .left-col {
        width: 180px;
        min-width: 180px;
        background: #f8f8f8;
        padding: 16px 14px;
        border-right: 2px solid ${themeColor};
      }
      .col-section { margin-bottom: 14px; }
      .col-title {
        font-size: 8.5px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${themeColor};
        border-bottom: 1.5px solid ${themeColor};
        padding-bottom: 3px;
        margin-bottom: 6px;
      }
      .col-item {
        font-size: 9.5px;
        color: #333;
        margin-bottom: 3px;
        line-height: 1.4;
        word-break: break-all;
      }
      .col-sub {
        font-size: 8.5px;
        color: #888;
        margin-bottom: 4px;
        margin-top: -1px;
      }
  
      /* ── Right Column ── */
      .right-col { flex: 1; padding: 16px 18px; }
      .main-section { margin-bottom: 13px; }
      .main-title {
        font-size: 9.5px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #ffffff;
        background: ${themeColor};
        padding: 3px 8px;
        margin-bottom: 8px;
        display: inline-block;
      }
      .summary-text {
        font-size: 10.5px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 8px; }
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
      .entry-company {
        font-size: 11px;
        font-weight: 700;
        color: #1a1a1a;
      }
      .entry-role {
        font-size: 10.5px;
        font-style: italic;
        color: #444;
      }
      .entry-role-block {
        font-size: 10px;
        font-style: italic;
        color: #555;
        margin-top: 1px;
      }
      .entry-location {
        font-size: 9.5px;
        color: #777;
        margin-top: 1px;
      }
      .entry-date {
        font-size: 9.5px;
        color: #666;
        white-space: nowrap;
        margin-left: 8px;
        text-align: right;
      }
      .entry-desc { margin-top: 4px; }
      .bullet {
        font-size: 10px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 4px;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
  
    <!-- Top Band -->
    <div class="top-band">
    ${photo ? `<div class="photo-box">
      <img src="${photo}" class="photo-img" />
    </div>` : ""}
      <div>
        <div class="band-name">${name}</div>
        ${jobTitle ? `<div class="band-title">${jobTitle}</div>` : ""}
      </div>
    </div>
  
    <!-- Body -->
    <div class="body">
      <!-- Left -->
      <div class="left-col">
        ${contactLeft}
        ${skillsLeft}
        ${languagesLeft}
        ${certsLeft}
        ${interestsLeft}
      </div>
  
      <!-- Right -->
      <div class="right-col">
        ${summaryRight}
        ${experienceRight}
        ${educationRight}
        ${projectsRight}
        ${achievementsRight}
      </div>
    </div>
  
  </body>
  </html>`;
}




// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 9 — modern-minimal
// Style: Lots of whitespace, elegant thin typography, subtle accent line,
//        clean single column, professional for any field
// ─────────────────────────────────────────────────────────────────────────────
function buildModernMinimal(resume, themeColor = "#1E3A5F") {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";
    const photo = p.photo || "";

    const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

    const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);

    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">Profile</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">Experience</div>
        ${resume.experience.map(exp => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(exp.role || exp.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}</div>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">Education</div>
        ${resume.education.map(edu => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(edu.institution || edu.school || "")}</div>
                <div class="entry-subtitle">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</div>
                ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
              </div>
            </div>
          </div>`).join("")}
      </div>` : "";

    // ── Skills ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">Skills</div>
        <div class="skills-grid">
          ${resume.skills.map(s => `<div class="skill-item">
            <span class="skill-dot" style="background:${themeColor}"></span>
            ${escapeHtml(s.name)}
          </div>`).join("")}
        </div>
      </div>` : "";

    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">Projects</div>
        ${resume.projects.map(proj => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(proj.title || "")}</div>
                ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` · ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Certifications ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">Certifications</div>
        ${resume.certifications.map(c => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(c.name || "")}</div>
                ${c.issuer ? `<div class="entry-subtitle">${escapeHtml(c.issuer)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(c.issueDate || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";

    // ── Languages ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">Languages</div>
        <div class="lang-row">
          ${resume.languages.map(l => `
            <span class="lang-item"><strong>${escapeHtml(l.name)}</strong> — ${escapeHtml(l.proficiency || "")}</span>
          `).join('<span class="lang-sep"> &nbsp;·&nbsp; </span>')}
        </div>
      </div>` : "";

    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">Achievements</div>
        ${resume.achievements.map(a => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(a.title || "")}</div>
                ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="entry-desc"><div class="bullet">• ${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";

    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">Interests</div>
        <div class="lang-row">
          ${resume.interests.map(i => `<span class="lang-item">${escapeHtml(i.name)}</span>`).join('<span class="lang-sep"> &nbsp;·&nbsp; </span>')}
        </div>
      </div>` : "";

    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">Training & Workshops</div>
        ${resume.training.map(t => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(t.title || "")}</div>
                ${t.organization ? `<div class="entry-subtitle">${escapeHtml(t.organization)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11px;
        color: #2a2a2a;
        background: #ffffff;
        padding: 40px 48px;
        line-height: 1.6;
      }
  
      /* ── Header ── */
      .header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 28px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      }
      .photo-box {
        width: 70px;
        height: 70px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e0e0e0;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .photo-img { width:100%; height:100%; object-fit:cover; }
      .photo-initials {
        font-size: 20px;
        font-weight: 700;
        color: ${themeColor};
      }
      .header-info { flex: 1; }
      .header-name {
        font-size: 26px;
        font-weight: 300;
        color: #1a1a1a;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .header-title {
        font-size: 11px;
        color: ${themeColor};
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 400;
        margin-bottom: 8px;
      }
      .header-contact {
        font-size: 9.5px;
        color: #777;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .contact-item { color: #666; }
  
      /* ── Section ── */
      .section { margin-bottom: 22px; }
  
      .section-header {
        font-size: 10px;
        font-weight: 400;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: ${themeColor};
        margin-bottom: 10px;
        padding-bottom: 4px;
        border-bottom: 1px solid ${themeColor}40;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 10.5px;
        color: #444;
        line-height: 1.7;
        font-style: italic;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 10px; }
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
      .entry-title {
        font-size: 11px;
        font-weight: 600;
        color: #1a1a1a;
      }
      .entry-subtitle {
        font-size: 10px;
        color: #666;
        margin-top: 1px;
        font-style: italic;
      }
      .entry-grade { font-size: 9.5px; color: #777; margin-top: 1px; }
      .entry-date {
        font-size: 9.5px;
        color: #999;
        white-space: nowrap;
        margin-left: 12px;
        padding-top: 1px;
        font-style: italic;
      }
      .entry-desc { margin-top: 5px; }
      .bullet {
        font-size: 10.5px;
        color: #444;
        margin-bottom: 2px;
        padding-left: 4px;
        line-height: 1.6;
      }
  
      /* ── Skills 2-col grid ── */
      .skills-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 4px 16px;
      }
      .skill-item {
        font-size: 10px;
        color: #444;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .skill-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        flex-shrink: 0;
      }
  
      /* ── Languages / Interests ── */
      .lang-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      .lang-item { font-size: 10.5px; color: #444; }
      .lang-sep { font-size: 10.5px; color: #bbb; }
    </style>
  </head>
  <body>
  
    <!-- Header -->
    <div class="header">
    ${photo ? `<div class="photo-box">
      <img src="${photo}" class="photo-img" />
    </div>` : ""}
      <div class="header-info">
        <div class="header-name">${name}</div>
        ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
        <div class="header-contact">
          ${contactParts.map(c => `<span class="contact-item">${c}</span>`).join("")}
        </div>
      </div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
}
// ROUTER — getTemplate(templateId, resume)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 10 — modern-bold
// Style: Strong color banner top, bold typography, two-column body,
//        accent colored section titles, clean and impactful
// ─────────────────────────────────────────────────────────────────────────────
function buildModernBold(resume, themeColor = "#1E3A5F") {
    const p = resume.personal || {};
    const name = escapeHtml(p.fullName) || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle) || "";
    const email = escapeHtml(p.email) || "";
    const phone = escapeHtml(p.phone) || "";
    const location = escapeHtml(p.location) || "";
    const linkedin = escapeHtml(p.linkedin) || "";
    const github = escapeHtml(p.github) || "";
    const website = escapeHtml(p.website) || "";
    const summary = escapeHtml(p.summary) || "";
    const photo = p.photo || "";

    const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

    // ── Left Column ──
    const contactLeft = `
      <div class="col-section">
        <div class="col-title">CONTACT</div>
        ${email ? `<div class="col-item">✉ ${email}</div>` : ""}
        ${phone ? `<div class="col-item">✆ ${phone}</div>` : ""}
        ${location ? `<div class="col-item">⚲ ${location}</div>` : ""}
        ${linkedin ? `<div class="col-item">in ${linkedin}</div>` : ""}
        ${github ? `<div class="col-item">⌥ ${github}</div>` : ""}
        ${website ? `<div class="col-item">⊕ ${website}</div>` : ""}
      </div>`;

    const skillsLeft = resume.skills?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">SKILLS</div>
        ${resume.skills.map(s => `
          <div class="skill-item">
            <div class="skill-name">${escapeHtml(s.name)}</div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" style="width:${s.level === 'expert' ? '90%' : s.level === 'intermediate' ? '65%' : '40%'}"></div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const languagesLeft = resume.languages?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">LANGUAGES</div>
        ${resume.languages.map(l => `
          <div class="col-item"><strong>${escapeHtml(l.name)}</strong></div>
          <div class="col-sub">${escapeHtml(l.proficiency || "")}</div>
        `).join("")}
      </div>` : "";

    const interestsLeft = resume.interests?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">INTERESTS</div>
        <div class="interests-wrap">
          ${resume.interests.map(i => `<span class="interest-chip">${escapeHtml(i.name)}</span>`).join("")}
        </div>
      </div>` : "";

    const certsLeft = resume.certifications?.length > 0 ? `
      <div class="col-section">
        <div class="col-title">CERTIFICATIONS</div>
        ${resume.certifications.map(c => `
          <div class="col-item">${escapeHtml(c.name)}</div>
          ${c.issuer ? `<div class="col-sub">${escapeHtml(c.issuer)}</div>` : ""}
        `).join("")}
      </div>` : "";

    // ── Right Column ──
    const summaryRight = summary ? `
      <div class="main-section">
        <div class="main-title">ABOUT ME</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";

    const experienceRight = resume.experience?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">EXPERIENCE</div>
        ${resume.experience.map(exp => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(exp.role || exp.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}</div>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const educationRight = resume.education?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">EDUCATION</div>
        ${resume.education.map(edu => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</div>
                <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}</div>
                ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
              </div>
            </div>
          </div>`).join("")}
      </div>` : "";

    const projectsRight = resume.projects?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">PROJECTS</div>
        ${resume.projects.map(proj => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(proj.title || "")}</div>
                ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` · ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const achievementsRight = resume.achievements?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">ACHIEVEMENTS</div>
        ${resume.achievements.map(a => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(a.title || "")}</div>
                ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="entry-desc"><div class="bullet">• ${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";

    const trainingRight = resume.training?.length > 0 ? `
      <div class="main-section">
        <div class="main-title">TRAINING</div>
        ${resume.training.map(t => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(t.title || "")}</div>
                ${t.organization ? `<div class="entry-subtitle">${escapeHtml(t.organization)}</div>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
  
      /* ── Bold Banner ── */
      .banner {
        background: ${themeColor};
        padding: 0;
      }
      .banner-top {
        padding: 22px 24px 16px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .photo-box {
        width: 72px;
        height: 72px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.5);
        background: rgba(255,255,255,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .photo-img { width:100%; height:100%; object-fit:cover; }
      .photo-initials {
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
      }
      .banner-info { flex: 1; }
      .banner-name {
        font-size: 26px;
        font-weight: 900;
        color: #ffffff;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .banner-title {
        font-size: 11px;
        color: rgba(255,255,255,0.8);
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .banner-bottom {
        background: rgba(0,0,0,0.2);
        padding: 8px 24px;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
      }
      .contact-item {
        font-size: 9px;
        color: rgba(255,255,255,0.85);
      }
  
      /* ── Body ── */
      .body {
        display: flex;
        flex: 1;
      }
  
      /* ── Left Column ── */
      .left-col {
        width: 195px;
        min-width: 195px;
        background: #f7f7f7;
        padding: 18px 14px;
        border-right: 3px solid ${themeColor};
      }
      .col-section { margin-bottom: 16px; }
      .col-title {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #ffffff;
        background: ${themeColor};
        padding: 3px 7px;
        margin-bottom: 8px;
        display: inline-block;
      }
      .col-item {
        font-size: 9.5px;
        color: #333;
        margin-bottom: 3px;
        line-height: 1.4;
        word-break: break-all;
      }
      .col-sub {
        font-size: 8.5px;
        color: #888;
        margin-bottom: 5px;
        margin-top: -1px;
      }
  
      /* ── Skill Bars ── */
      .skill-item { margin-bottom: 7px; }
      .skill-name { font-size: 9.5px; color: #333; margin-bottom: 2px; }
      .skill-bar-bg {
        height: 4px;
        background: #ddd;
        border-radius: 2px;
        overflow: hidden;
      }
      .skill-bar-fill {
        height: 100%;
        background: ${themeColor};
        border-radius: 2px;
      }
  
      /* ── Interests ── */
      .interests-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
      .interest-chip {
        font-size: 8.5px;
        color: ${themeColor};
        background: white;
        border-radius: 3px;
        padding: 2px 6px;
        border: 1px solid ${themeColor};
      }
  
      /* ── Right Column ── */
      .right-col { flex: 1; padding: 18px 20px; }
      .main-section { margin-bottom: 14px; }
      .main-title {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${themeColor};
        border-left: 3px solid ${themeColor};
        padding-left: 7px;
        margin-bottom: 9px;
      }
      .summary-text {
        font-size: 10.5px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 9px; }
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
      .entry-title {
        font-size: 11px;
        font-weight: 700;
        color: #1a1a1a;
      }
      .entry-subtitle {
        font-size: 10px;
        color: #555;
        font-style: italic;
        margin-top: 1px;
      }
      .entry-grade { font-size: 9.5px; color: #666; margin-top: 1px; }
      .entry-date {
        font-size: 9.5px;
        color: #666;
        white-space: nowrap;
        margin-left: 8px;
        text-align: right;
      }
      .entry-desc { margin-top: 4px; }
      .bullet {
        font-size: 10px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 4px;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
  
    <!-- Banner -->
    <div class="banner">
      <div class="banner-top">
      ${photo ? `<div class="photo-box">
        <img src="${photo}" class="photo-img" />
      </div>` : ""}
        <div class="banner-info">
          <div class="banner-name">${name}</div>
          ${jobTitle ? `<div class="banner-title">${jobTitle}</div>` : ""}
        </div>
      </div>
      <div class="banner-bottom">
        ${[email, phone, location, linkedin, github, website].filter(Boolean).map(c => `<span class="contact-item">${c}</span>`).join("")}
      </div>
    </div>
  
    <!-- Body -->
    <div class="body">
      <div class="left-col">
        ${contactLeft}
        ${skillsLeft}
        ${languagesLeft}
        ${certsLeft}
        ${interestsLeft}
      </div>
      <div class="right-col">
        ${summaryRight}
        ${experienceRight}
        ${educationRight}
        ${projectsRight}
        ${achievementsRight}
        ${trainingRight}
      </div>
    </div>
  
  </body>
  </html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 11 — creative-splash
// Style: HAPPY reference — white card, colorful diagonal corner shapes,
//        large name top-left, photo top-right, icon contact row,
//        ALL CAPS bold section headers with icons, single column
// ─────────────────────────────────────────────────────────────────────────────
function buildCreativeSplash(resume, themeColor = "#1E3A5F") {
  const p = resume.personal || {};
  const name = escapeHtml(p.fullName) || "Your Name";
  const jobTitle = escapeHtml(p.jobTitle) || "";
  const email = escapeHtml(p.email) || "";
  const phone = escapeHtml(p.phone) || "";
  const location = escapeHtml(p.location) || "";
  const linkedin = escapeHtml(p.linkedin) || "";
  const github = escapeHtml(p.github) || "";
  const website = escapeHtml(p.website) || "";
  const summary = escapeHtml(p.summary) || "";
  const photo = p.photo || "";

  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

  // Derive accent colors from themeColor
  // We'll use themeColor as the primary accent, and generate a lighter tint
  const summarySection = summary ? `
    <div class="section">
      <p class="summary-text">${summary}</p>
    </div>` : "";

  const experienceSection = resume.experience?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">💼</span> PROFESSIONAL EXPERIENCE</div>
      ${resume.experience.map(exp => `
        <div class="entry two-col-entry">
          <div class="entry-left-col">
            <div class="entry-date-splash">${escapeHtml(exp.startDate || "")}${exp.startDate ? " –" : ""}<br>${exp.current ? "present" : escapeHtml(exp.endDate || "")}</div>
            ${exp.location ? `<div class="entry-loc">${escapeHtml(exp.location)}</div>` : ""}
          </div>
          <div class="entry-right-col">
            <div class="entry-title">${escapeHtml(exp.company || exp.companyName || "")}, <span class="entry-role">${escapeHtml(exp.role || exp.title || "")}</span></div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>
        </div>`).join("")}
    </div>` : "";

  const educationSection = resume.education?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🎓</span> EDUCATION</div>
      ${resume.education.map(edu => `
        <div class="entry two-col-entry">
          <div class="entry-left-col">
            <div class="entry-date-splash">${escapeHtml(edu.startDate || "")}${edu.startDate ? " –" : ""}<br>${edu.current ? "present" : escapeHtml(edu.endDate || "")}</div>
          </div>
          <div class="entry-right-col">
            <div class="entry-title"><strong>${escapeHtml(edu.degree || "")}${edu.field ? `, ${escapeHtml(edu.field)}` : ""}</strong></div>
            <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}</div>
            ${edu.grade ? `<div class="entry-subtitle">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>
        </div>`).join("")}
    </div>` : "";

  const languagesSection = resume.languages?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🌐</span> LANGUAGES</div>
      <div class="lang-dot-row">
        ${resume.languages.map(l => {
            const dots = l.proficiency === "fluent" ? 5 : l.proficiency === "conversational" ? 4 : 2;
            const dotHtml = Array.from({length: 5}, (_, i) =>
              `<span class="dot ${i < dots ? 'dot-filled' : 'dot-empty'}"></span>`
            ).join("");
            return `<span class="lang-block"><span class="lang-name">${escapeHtml(l.name)}</span> ${dotHtml}</span>`;
        }).join("")}
      </div>
    </div>` : "";

  const skillsSection = resume.skills?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">⚡</span> SKILLS</div>
      <p class="skills-inline">${resume.skills.map(s => escapeHtml(s.name)).join(" &nbsp;•&nbsp; ")}</p>
    </div>` : "";

  const projectsSection = resume.projects?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🚀</span> PROJECTS</div>
      ${resume.projects.map(proj => `
        <div class="entry two-col-entry">
          <div class="entry-left-col">
            <div class="entry-date-splash">${escapeHtml(proj.startDate || "")}${proj.startDate ? " –" : ""}<br>${proj.current ? "present" : escapeHtml(proj.endDate || "")}</div>
          </div>
          <div class="entry-right-col">
            <div class="entry-title"><strong>${escapeHtml(proj.title || "")}</strong>${proj.role ? `, <span class="entry-role">${escapeHtml(proj.role)}</span>` : ""}</div>
            ${proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.technologies)}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
          </div>
        </div>`).join("")}
    </div>` : "";

  const certsSection = resume.certifications?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🏆</span> CERTIFICATIONS</div>
      ${resume.certifications.map(c => `
        <div class="entry two-col-entry">
          <div class="entry-left-col"><div class="entry-date-splash">${escapeHtml(c.issueDate || "")}</div></div>
          <div class="entry-right-col">
            <div class="entry-title"><strong>${escapeHtml(c.name || "")}</strong></div>
            ${c.issuer ? `<div class="entry-subtitle">${escapeHtml(c.issuer)}</div>` : ""}
          </div>
        </div>`).join("")}
    </div>` : "";

  const achievementsSection = resume.achievements?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🌟</span> ACHIEVEMENTS</div>
      ${resume.achievements.map(a => `
        <div class="entry two-col-entry">
          <div class="entry-left-col"><div class="entry-date-splash">${escapeHtml(a.date || "")}</div></div>
          <div class="entry-right-col">
            <div class="entry-title"><strong>${escapeHtml(a.title || "")}</strong>${a.issuer ? `, <span class="entry-role">${escapeHtml(a.issuer)}</span>` : ""}</div>
            ${a.description ? `<div class="entry-desc"><div class="bullet">${escapeHtml(a.description)}</div></div>` : ""}
          </div>
        </div>`).join("")}
    </div>` : "";

  const trainingSection = resume.training?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">📚</span> TRAINING</div>
      ${resume.training.map(t => `
        <div class="entry two-col-entry">
          <div class="entry-left-col"><div class="entry-date-splash">${escapeHtml(t.date || "")}</div></div>
          <div class="entry-right-col">
            <div class="entry-title"><strong>${escapeHtml(t.title || "")}</strong>${t.organization ? `, <span class="entry-role">${escapeHtml(t.organization)}</span>` : ""}</div>
          </div>
        </div>`).join("")}
    </div>` : "";

  const interestsSection = resume.interests?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">💡</span> INTERESTS</div>
      <p class="skills-inline">${resume.interests.map(i => escapeHtml(i.name)).join(" &nbsp;•&nbsp; ")}</p>
    </div>` : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Georgia', serif;
    font-size: 11px;
    color: #1a1a1a;
    background: #f0f0f0;
    padding: 20px;
    line-height: 1.5;
  }

  /* ── Outer card with corner decorations ── */
  .card {
    background: #ffffff;
    position: relative;
    overflow: hidden;
    padding: 32px 36px 36px;
  }

  /* Corner splashes — top-right and bottom-left */
  .card::before {
    content: "";
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    background: ${themeColor};
    opacity: 0.15;
    border-radius: 50%;
  }
  .card::after {
    content: "";
    position: absolute;
    bottom: -50px;
    left: -50px;
    width: 180px;
    height: 180px;
    background: ${themeColor};
    opacity: 0.10;
    border-radius: 50%;
  }
  .corner-tl {
    position: absolute;
    top: 0; left: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 80px 80px 0 0;
    border-color: ${themeColor}22 transparent transparent transparent;
  }
  .corner-br {
    position: absolute;
    bottom: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 0 70px 70px;
    border-color: transparent transparent ${themeColor}18 transparent;
  }

  /* ── Header ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
    position: relative;
    z-index: 1;
  }
  .header-left { flex: 1; }
  .header-name {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 3px;
    line-height: 1.1;
  }
  .header-title {
    font-size: 14px;
    font-style: italic;
    color: ${themeColor};
    margin-bottom: 10px;
  }
  .contact-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .contact-item {
    font-size: 9.5px;
    color: #555;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .contact-icon { color: ${themeColor}; font-size: 10px; }

  /* ── Photo ── */
  .photo-box {
    width: 88px;
    height: 88px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid ${themeColor}40;
    background: ${themeColor}18;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 16px;
  }
  .photo-img { width:100%; height:100%; object-fit:cover; }
  .photo-initials {
    font-size: 24px;
    font-weight: 700;
    color: ${themeColor};
  }

  /* ── Summary ── */
  .summary-text {
    font-size: 10.5px;
    color: #444;
    line-height: 1.65;
    text-align: justify;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }

  /* ── Section ── */
  .section {
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }
  .section-header {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1.5px solid #e8e8e8;
  }
  .sec-icon { font-size: 12px; }

  /* ── Two-col entry layout (date left, content right) ── */
  .two-col-entry {
    display: flex;
    gap: 12px;
    margin-bottom: 9px;
    align-items: flex-start;
  }
  .entry-left-col {
    width: 80px;
    min-width: 80px;
    text-align: right;
    padding-top: 1px;
  }
  .entry-date-splash {
    font-size: 9px;
    color: #888;
    line-height: 1.4;
  }
  .entry-loc {
    font-size: 8.5px;
    color: #aaa;
    margin-top: 2px;
  }
  .entry-right-col { flex: 1; }
  .entry-title {
    font-size: 11px;
    font-weight: 700;
    color: #1a1a1a;
  }
  .entry-role {
    font-style: italic;
    font-weight: 400;
    color: #444;
  }
  .entry-subtitle {
    font-size: 10px;
    color: #666;
    margin-top: 1px;
  }
  .entry-desc { margin-top: 3px; }
  .bullet {
    font-size: 10px;
    color: #444;
    margin-bottom: 2px;
    padding-left: 2px;
    line-height: 1.5;
  }

  /* ── Language dots ── */
  .lang-dot-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }
  .lang-block {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .lang-name {
    font-size: 10px;
    color: #333;
    min-width: 52px;
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
  }
  .dot-filled { background: ${themeColor}; }
  .dot-empty { background: ${themeColor}30; border: 1px solid ${themeColor}50; }

  /* ── Skills inline ── */
  .skills-inline {
    font-size: 10.5px;
    color: #333;
    line-height: 1.8;
  }
</style>
</head>
<body>
<div class="card">
  <div class="corner-tl"></div>
  <div class="corner-br"></div>

  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <div class="header-name">${name}</div>
      ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
      <div class="contact-row">
        ${location ? `<span class="contact-item"><span class="contact-icon">📍</span> ${location}</span>` : ""}
        ${phone ? `<span class="contact-item"><span class="contact-icon">📞</span> ${phone}</span>` : ""}
        ${email ? `<span class="contact-item"><span class="contact-icon">✉</span> ${email}</span>` : ""}
        ${linkedin ? `<span class="contact-item"><span class="contact-icon">in</span> ${linkedin}</span>` : ""}
        ${github ? `<span class="contact-item"><span class="contact-icon">⌥</span> ${github}</span>` : ""}
        ${website ? `<span class="contact-item"><span class="contact-icon">⊕</span> ${website}</span>` : ""}
      </div>
    </div>
    ${photo ? `<div class="photo-box">
      <img src="${photo}" class="photo-img" />
    </div>` : ""}
  </div>

  ${summarySection}
  ${experienceSection}
  ${educationSection}
  ${languagesSection}
  ${skillsSection}
  ${projectsSection}
  ${certsSection}
  ${achievementsSection}
  ${trainingSection}
  ${interestsSection}
</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 12 — creative-timeline
// Style: Left vertical timeline line with colored dots,
//        experience flows down the timeline, clean right content area
// ─────────────────────────────────────────────────────────────────────────────
function buildCreativeTimeline(resume, themeColor = "#1E3A5F") {
  const p = resume.personal || {};
  const name = escapeHtml(p.fullName) || "Your Name";
  const jobTitle = escapeHtml(p.jobTitle) || "";
  const email = escapeHtml(p.email) || "";
  const phone = escapeHtml(p.phone) || "";
  const location = escapeHtml(p.location) || "";
  const linkedin = escapeHtml(p.linkedin) || "";
  const github = escapeHtml(p.github) || "";
  const website = escapeHtml(p.website) || "";
  const summary = escapeHtml(p.summary) || "";
  const photo = p.photo || "";

  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

  const contactParts = [
      email ? `✉ ${email}` : "",
      phone ? `✆ ${phone}` : "",
      location ? `📍 ${location}` : "",
      linkedin ? `in ${linkedin}` : "",
      github ? `⌥ ${github}` : "",
      website ? `⊕ ${website}` : "",
  ].filter(Boolean);

  // Timeline items helper
  const timelineItem = (dateStr, titleHtml, subtitleHtml, descHtml) => `
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-date">${dateStr}</div>
      <div class="tl-content">
        <div class="tl-title">${titleHtml}</div>
        ${subtitleHtml ? `<div class="tl-subtitle">${subtitleHtml}</div>` : ""}
        ${descHtml ? `<div class="tl-desc">${descHtml}</div>` : ""}
      </div>
    </div>`;

  const summarySection = summary ? `
    <div class="section">
      <div class="section-header">Profile</div>
      <p class="summary-text">${summary}</p>
    </div>` : "";

  const experienceSection = resume.experience?.length > 0 ? `
    <div class="section">
      <div class="section-header">Experience</div>
      <div class="timeline">
        ${resume.experience.map(exp => timelineItem(
          `${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}`,
          `${escapeHtml(exp.role || exp.title || "")}`,
          `${escapeHtml(exp.company || exp.companyName || "")}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}`,
          exp.description ? buildBullets(exp.description) : ""
        )).join("")}
      </div>
    </div>` : "";

  const educationSection = resume.education?.length > 0 ? `
    <div class="section">
      <div class="section-header">Education</div>
      <div class="timeline">
        ${resume.education.map(edu => timelineItem(
          `${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}`,
          `${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}`,
          `${escapeHtml(edu.institution || edu.school || "")}${edu.grade ? ` · Grade: ${escapeHtml(edu.grade)}` : ""}`,
          ""
        )).join("")}
      </div>
    </div>` : "";

  const projectsSection = resume.projects?.length > 0 ? `
    <div class="section">
      <div class="section-header">Projects</div>
      <div class="timeline">
        ${resume.projects.map(proj => timelineItem(
          `${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}`,
          escapeHtml(proj.title || ""),
          `${escapeHtml(proj.role || "")}${proj.technologies ? ` · ${escapeHtml(proj.technologies)}` : ""}`,
          proj.description ? buildBullets(proj.description) : ""
        )).join("")}
      </div>
    </div>` : "";

  const skillsSection = resume.skills?.length > 0 ? `
    <div class="section">
      <div class="section-header">Skills</div>
      <div class="skills-wrap">
        ${resume.skills.map(s => `<span class="skill-chip">${escapeHtml(s.name)}</span>`).join("")}
      </div>
    </div>` : "";

  const certsSection = resume.certifications?.length > 0 ? `
    <div class="section">
      <div class="section-header">Certifications</div>
      <div class="timeline">
        ${resume.certifications.map(c => timelineItem(
          escapeHtml(c.issueDate || ""),
          escapeHtml(c.name || ""),
          escapeHtml(c.issuer || ""),
          ""
        )).join("")}
      </div>
    </div>` : "";

  const languagesSection = resume.languages?.length > 0 ? `
    <div class="section">
      <div class="section-header">Languages</div>
      <div class="skills-wrap">
        ${resume.languages.map(l => `<span class="skill-chip">${escapeHtml(l.name)}${l.proficiency ? ` · ${escapeHtml(l.proficiency)}` : ""}</span>`).join("")}
      </div>
    </div>` : "";

  const achievementsSection = resume.achievements?.length > 0 ? `
    <div class="section">
      <div class="section-header">Achievements</div>
      <div class="timeline">
        ${resume.achievements.map(a => timelineItem(
          escapeHtml(a.date || ""),
          escapeHtml(a.title || ""),
          escapeHtml(a.issuer || ""),
          a.description ? `<div class="bullet">• ${escapeHtml(a.description)}</div>` : ""
        )).join("")}
      </div>
    </div>` : "";

  const trainingSection = resume.training?.length > 0 ? `
    <div class="section">
      <div class="section-header">Training & Workshops</div>
      <div class="timeline">
        ${resume.training.map(t => timelineItem(
          escapeHtml(t.date || ""),
          escapeHtml(t.title || ""),
          escapeHtml(t.organization || ""),
          ""
        )).join("")}
      </div>
    </div>` : "";

  const interestsSection = resume.interests?.length > 0 ? `
    <div class="section">
      <div class="section-header">Interests</div>
      <div class="skills-wrap">
        ${resume.interests.map(i => `<span class="skill-chip">${escapeHtml(i.name)}</span>`).join("")}
      </div>
    </div>` : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 11px;
    color: #1a1a1a;
    background: #ffffff;
  }

  /* ── Header banner ── */
  .header {
    background: ${themeColor};
    padding: 24px 28px;
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .photo-box {
    width: 80px; height: 80px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .photo-img { width:100%; height:100%; object-fit:cover; }
  .photo-initials { font-size: 22px; font-weight: 800; color: #fff; }
  .header-info { flex: 1; }
  .header-name { font-size: 26px; font-weight: 900; color: #fff; margin-bottom: 3px; }
  .header-title { font-size: 11px; color: rgba(255,255,255,0.8); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
  .contact-row { display: flex; flex-wrap: wrap; gap: 10px; }
  .contact-item { font-size: 9px; color: rgba(255,255,255,0.75); }

  /* ── Body ── */
  .body { padding: 20px 28px; }

  /* ── Section ── */
  .section { margin-bottom: 18px; }
  .section-header {
    font-size: 12px;
    font-weight: 800;
    color: ${themeColor};
    letter-spacing: 1px;
    text-transform: uppercase;
    border-left: 4px solid ${themeColor};
    padding-left: 8px;
    margin-bottom: 12px;
  }
  .summary-text { font-size: 10.5px; color: #444; line-height: 1.65; }

  /* ── Timeline ── */
  .timeline { position: relative; padding-left: 28px; }
  .timeline::before {
    content: "";
    position: absolute;
    left: 6px; top: 6px; bottom: 6px;
    width: 2px;
    background: ${themeColor}30;
  }
  .tl-item {
    position: relative;
    margin-bottom: 12px;
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto;
    column-gap: 10px;
  }
  .tl-dot {
    position: absolute;
    left: -25px;
    top: 4px;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: ${themeColor};
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px ${themeColor}50;
  }
  .tl-date {
    grid-column: 1;
    grid-row: 1;
    font-size: 9px;
    color: #888;
    padding-top: 2px;
    line-height: 1.4;
  }
  .tl-content { grid-column: 2; grid-row: 1 / span 2; }
  .tl-title { font-size: 11px; font-weight: 700; color: #1a1a1a; margin-bottom: 1px; }
  .tl-subtitle { font-size: 10px; color: #666; font-style: italic; margin-bottom: 3px; }
  .tl-desc { margin-top: 3px; }
  .bullet { font-size: 10px; color: #444; margin-bottom: 2px; padding-left: 2px; line-height: 1.5; }

  /* ── Skills chips ── */
  .skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-chip {
    font-size: 9.5px;
    color: ${themeColor};
    border: 1.5px solid ${themeColor}50;
    border-radius: 20px;
    padding: 3px 10px;
    background: ${themeColor}08;
  }
</style>
</head>
<body>
<div class="header">
${photo ? `<div class="photo-box">
  <img src="${photo}" class="photo-img" />
</div>` : ""}
  <div class="header-info">
    <div class="header-name">${name}</div>
    ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
    <div class="contact-row">
      ${contactParts.map(c => `<span class="contact-item">${c}</span>`).join("")}
    </div>
  </div>
</div>

<div class="body">
  ${summarySection}
  ${experienceSection}
  ${educationSection}
  ${projectsSection}
  ${skillsSection}
  ${certsSection}
  ${languagesSection}
  ${achievementsSection}
  ${trainingSection}
  ${interestsSection}
</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 13 — creative-grid
// Style: SPACE reference — two-column, left sidebar light bg with stacked
//        bold name, circular photo, skill bars, right column has content
// ─────────────────────────────────────────────────────────────────────────────
function buildCreativeGrid(resume, themeColor = "#1E3A5F") {
  const p = resume.personal || {};
  const name = escapeHtml(p.fullName) || "Your Name";
  const jobTitle = escapeHtml(p.jobTitle) || "";
  const email = escapeHtml(p.email) || "";
  const phone = escapeHtml(p.phone) || "";
  const location = escapeHtml(p.location) || "";
  const linkedin = escapeHtml(p.linkedin) || "";
  const github = escapeHtml(p.github) || "";
  const website = escapeHtml(p.website) || "";
  const summary = escapeHtml(p.summary) || "";
  const photo = p.photo || "";

  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

  // Derive a darker shade for right column
  // Left sidebar is themeColor tinted light, right is slightly darker

  // ── Left sidebar ──
  const skillsSidebar = resume.skills?.length > 0 ? `
    <div class="sb-section">
      <div class="sb-title">Skills</div>
      ${resume.skills.map(s => `
        <div class="skill-item">
          <div class="skill-name">${escapeHtml(s.name)}</div>
          <div class="skill-bar-bg">
            <div class="skill-bar-fill" style="width:${s.level === 'expert' ? '90%' : s.level === 'intermediate' ? '65%' : '40%'}"></div>
          </div>
        </div>`).join("")}
    </div>` : "";

  const langSidebar = resume.languages?.length > 0 ? `
    <div class="sb-section">
      <div class="sb-title">Languages</div>
      ${resume.languages.map(l => `
        <div class="sb-lang">
          <span class="sb-lang-name">${escapeHtml(l.name)}</span>
          <div class="skill-bar-bg" style="margin-top:2px;">
            <div class="skill-bar-fill" style="width:${l.proficiency === 'fluent' ? '90%' : l.proficiency === 'conversational' ? '65%' : '40%'}"></div>
          </div>
        </div>`).join("")}
    </div>` : "";

  const certsSidebar = resume.certifications?.length > 0 ? `
    <div class="sb-section">
      <div class="sb-title">Certifications</div>
      ${resume.certifications.map(c => `
        <div class="sb-item">${escapeHtml(c.name)}</div>
        ${c.issuer ? `<div class="sb-sub">${escapeHtml(c.issuer)}</div>` : ""}
      `).join("")}
    </div>` : "";

  const interestsSidebar = resume.interests?.length > 0 ? `
    <div class="sb-section">
      <div class="sb-title">Interests</div>
      <div class="interests-wrap">
        ${resume.interests.map(i => `<span class="interest-chip">${escapeHtml(i.name)}</span>`).join("")}
      </div>
    </div>` : "";

  const achievementsSidebar = resume.achievements?.length > 0 ? `
    <div class="sb-section">
      <div class="sb-title">Achievements</div>
      ${resume.achievements.map(a => `
        <div class="sb-item">${escapeHtml(a.title)}</div>
        ${a.issuer ? `<div class="sb-sub">${escapeHtml(a.issuer)}</div>` : ""}
      `).join("")}
    </div>` : "";

  // ── Right column ──
  const summaryRight = summary ? `
    <div class="main-section">
      <p class="summary-text">${summary}</p>
    </div>` : "";

  const experienceRight = resume.experience?.length > 0 ? `
    <div class="main-section">
      <div class="main-title"><span class="title-icon">💼</span> Professional Experience</div>
      ${resume.experience.map(exp => `
        <div class="entry">
          <div class="entry-top">
            <div class="entry-title">${escapeHtml(exp.company || exp.companyName || "")}, <span class="entry-role">${escapeHtml(exp.role || exp.title || "")}</span></div>
            <div class="entry-meta">${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}</div>
          </div>
          ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const educationRight = resume.education?.length > 0 ? `
    <div class="main-section">
      <div class="main-title"><span class="title-icon">🎓</span> Education</div>
      ${resume.education.map(edu => `
        <div class="entry">
          <div class="entry-title"><strong>${escapeHtml(edu.degree || "")}${edu.field ? `, ${escapeHtml(edu.field)}` : ""}</strong></div>
          <div class="entry-meta">${escapeHtml(edu.institution || edu.school || "")} · ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}${edu.grade ? ` · ${escapeHtml(edu.grade)}` : ""}</div>
        </div>`).join("")}
    </div>` : "";

  const projectsRight = resume.projects?.length > 0 ? `
    <div class="main-section">
      <div class="main-title"><span class="title-icon">🚀</span> Projects</div>
      ${resume.projects.map(proj => `
        <div class="entry">
          <div class="entry-top">
            <div class="entry-title">${escapeHtml(proj.title || "")}${proj.role ? `, <span class="entry-role">${escapeHtml(proj.role)}</span>` : ""}</div>
            <div class="entry-meta">${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}${proj.technologies ? ` · ${escapeHtml(proj.technologies)}` : ""}</div>
          </div>
          ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const trainingRight = resume.training?.length > 0 ? `
    <div class="main-section">
      <div class="main-title"><span class="title-icon">📚</span> Training</div>
      ${resume.training.map(t => `
        <div class="entry">
          <div class="entry-title">${escapeHtml(t.title || "")}</div>
          <div class="entry-meta">${escapeHtml(t.organization || "")}${t.date ? ` · ${escapeHtml(t.date)}` : ""}</div>
        </div>`).join("")}
    </div>` : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 11px;
    color: #1a1a1a;
    background: #ffffff;
    display: flex;
    min-height: 100vh;
  }

  /* ── Left Sidebar ── */
  .sidebar {
    width: 210px;
    min-width: 210px;
    background: ${themeColor}12;
    border-right: 3px solid ${themeColor};
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
  }

  /* Name block — stacked bold style like SPACE template */
  .sb-name {
    font-size: 20px;
    font-weight: 900;
    color: ${themeColor};
    line-height: 1.1;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 4px;
    word-break: break-word;
  }
  .sb-job-title {
    font-size: 10px;
    color: #666;
    letter-spacing: 1px;
    margin-bottom: 14px;
  }

  /* Circular photo */
  .photo-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 14px;
  }
  .photo-circle {
    width: 80px; height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid ${themeColor}50;
    background: ${themeColor}18;
    display: flex; align-items: center; justify-content: center;
  }
  .photo-img { width:100%; height:100%; object-fit:cover; }
  .photo-initials { font-size: 22px; font-weight: 800; color: ${themeColor}; }

  /* Contact */
  .sb-contact { margin-bottom: 14px; }
  .sb-contact-item { font-size: 9px; color: #555; margin-bottom: 3px; word-break: break-all; }

  /* Sections */
  .sb-section { margin-bottom: 14px; }
  .sb-title {
    font-size: 10px;
    font-weight: 700;
    color: ${themeColor};
    border-bottom: 1.5px solid ${themeColor}40;
    padding-bottom: 3px;
    margin-bottom: 7px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .sb-item { font-size: 9.5px; color: #333; margin-bottom: 2px; }
  .sb-sub { font-size: 8.5px; color: #888; margin-bottom: 4px; }
  .sb-lang { margin-bottom: 6px; }
  .sb-lang-name { font-size: 9.5px; color: #333; }

  /* Skill bars */
  .skill-item { margin-bottom: 7px; }
  .skill-name { font-size: 9.5px; color: #333; margin-bottom: 2px; }
  .skill-bar-bg { height: 3px; background: ${themeColor}25; border-radius: 2px; overflow: hidden; }
  .skill-bar-fill { height: 100%; background: ${themeColor}; border-radius: 2px; }

  /* Interest chips */
  .interests-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
  .interest-chip {
    font-size: 8.5px; color: ${themeColor};
    border: 1px solid ${themeColor}40;
    border-radius: 10px; padding: 2px 7px;
    background: ${themeColor}08;
  }

  /* ── Right Column ── */
  .main {
    flex: 1;
    background: ${themeColor}06;
    padding: 20px 20px;
  }

  .summary-text {
    font-size: 10.5px;
    color: #444;
    line-height: 1.65;
    margin-bottom: 16px;
    padding: 10px 12px;
    background: white;
    border-left: 3px solid ${themeColor};
    border-radius: 0 4px 4px 0;
  }

  .main-section { margin-bottom: 16px; }
  .main-title {
    font-size: 11px;
    font-weight: 800;
    color: ${themeColor};
    margin-bottom: 9px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .title-icon { font-size: 12px; }

  .entry { margin-bottom: 9px; background: white; padding: 8px 10px; border-radius: 4px; }
  .entry-top { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
  .entry-title { font-size: 10.5px; font-weight: 700; color: #1a1a1a; }
  .entry-role { font-style: italic; font-weight: 400; color: #555; }
  .entry-meta { font-size: 9px; color: #888; }
  .entry-desc { margin-top: 4px; }
  .bullet { font-size: 10px; color: #444; margin-bottom: 2px; padding-left: 2px; line-height: 1.5; }
</style>
</head>
<body>
<!-- Sidebar -->
<div class="sidebar">
  <div class="sb-name">${name.split(" ").join("<br/>")}</div>
  ${jobTitle ? `<div class="sb-job-title">${jobTitle}</div>` : ""}

  <div class="photo-wrap">
    <div class="photo-circle">
      ${photo ? `<img src="${photo}" class="photo-img"/>` : `<span class="photo-initials">${initials}</span>`}
    </div>
  </div>

  <div class="sb-contact">
    ${location ? `<div class="sb-contact-item">📍 ${location}</div>` : ""}
    ${phone ? `<div class="sb-contact-item">✆ ${phone}</div>` : ""}
    ${email ? `<div class="sb-contact-item">✉ ${email}</div>` : ""}
    ${linkedin ? `<div class="sb-contact-item">in ${linkedin}</div>` : ""}
    ${github ? `<div class="sb-contact-item">⌥ ${github}</div>` : ""}
    ${website ? `<div class="sb-contact-item">⊕ ${website}</div>` : ""}
  </div>

  ${skillsSidebar}
  ${langSidebar}
  ${certsSidebar}
  ${achievementsSidebar}
  ${interestsSidebar}
</div>

<!-- Main -->
<div class="main">
  ${summaryRight}
  ${experienceRight}
  ${educationRight}
  ${projectsRight}
  ${trainingRight}
</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 14 — creative-dark
// Style: ROSEWOOD / GREEN FRAME reference — colored border frame around
//        entire page, centered name header, contact icons in a row,
//        clean single column inside, skill dots in two-col grid
// ─────────────────────────────────────────────────────────────────────────────
function buildCreativeDark(resume, themeColor = "#1E3A5F") {
  const p = resume.personal || {};
  const name = escapeHtml(p.fullName) || "Your Name";
  const jobTitle = escapeHtml(p.jobTitle) || "";
  const email = escapeHtml(p.email) || "";
  const phone = escapeHtml(p.phone) || "";
  const location = escapeHtml(p.location) || "";
  const linkedin = escapeHtml(p.linkedin) || "";
  const github = escapeHtml(p.github) || "";
  const website = escapeHtml(p.website) || "";
  const summary = escapeHtml(p.summary) || "";
  const photo = p.photo || "";

  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

  const summarySection = summary ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">👤</span> PROFILE</div>
      <p class="summary-text">${summary}</p>
    </div>` : "";

  const experienceSection = resume.experience?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">💼</span> WORK EXPERIENCE</div>
      ${resume.experience.map(exp => `
        <div class="entry">
          <div class="entry-header">
            <div class="entry-left">
              <span class="entry-title">${escapeHtml(exp.role || exp.title || "")}</span>
              <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}</div>
            </div>
            <div class="entry-date">${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}</div>
          </div>
          ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const educationSection = resume.education?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🎓</span> EDUCATION</div>
      ${resume.education.map(edu => `
        <div class="entry">
          <div class="entry-header">
            <div class="entry-left">
              <span class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</span>
              <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}${edu.grade ? ` · ${escapeHtml(edu.grade)}` : ""}</div>
            </div>
            <div class="entry-date">${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}</div>
          </div>
        </div>`).join("")}
    </div>` : "";

  // Skills in 2-column dot rating grid (like ROSEWOOD)
  const skillsSection = resume.skills?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">⚡</span> SKILLS</div>
      <div class="skills-dot-grid">
        ${resume.skills.map(s => {
            const filled = s.level === 'expert' ? 5 : s.level === 'intermediate' ? 3 : 2;
            const dotHtml = Array.from({length: 5}, (_, i) =>
              `<span class="dot ${i < filled ? 'dot-filled' : 'dot-empty'}"></span>`
            ).join("");
            return `<div class="skill-dot-row"><span class="skill-dot-name">${escapeHtml(s.name)}</span><span class="skill-dots">${dotHtml}</span></div>`;
        }).join("")}
      </div>
    </div>` : "";

  const projectsSection = resume.projects?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🚀</span> PROJECTS</div>
      ${resume.projects.map(proj => `
        <div class="entry">
          <div class="entry-header">
            <div class="entry-left">
              <span class="entry-title">${escapeHtml(proj.title || "")}</span>
              ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` · ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
            </div>
            <div class="entry-date">${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}</div>
          </div>
          ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const certsSection = resume.certifications?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🏆</span> CERTIFICATES</div>
      <div class="cert-wrap">
        ${resume.certifications.map(c => `<span class="cert-chip">${escapeHtml(c.name)}</span>`).join("")}
      </div>
    </div>` : "";

  const languagesSection = resume.languages?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🌐</span> LANGUAGES</div>
      <div class="skills-dot-grid">
        ${resume.languages.map(l => {
            const filled = l.proficiency === 'fluent' ? 5 : l.proficiency === 'conversational' ? 3 : 2;
            const dotHtml = Array.from({length: 5}, (_, i) =>
              `<span class="dot ${i < filled ? 'dot-filled' : 'dot-empty'}"></span>`
            ).join("");
            return `<div class="skill-dot-row"><span class="skill-dot-name">${escapeHtml(l.name)}</span><span class="skill-dots">${dotHtml}</span></div>`;
        }).join("")}
      </div>
    </div>` : "";

  const achievementsSection = resume.achievements?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">🌟</span> ACHIEVEMENTS</div>
      ${resume.achievements.map(a => `
        <div class="entry">
          <div class="entry-header">
            <div class="entry-left">
              <span class="entry-title">${escapeHtml(a.title || "")}</span>
              ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
            </div>
            <div class="entry-date">${escapeHtml(a.date || "")}</div>
          </div>
          ${a.description ? `<div class="entry-desc"><div class="bullet">• ${escapeHtml(a.description)}</div></div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const trainingSection = resume.training?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">📚</span> TRAINING</div>
      ${resume.training.map(t => `
        <div class="entry">
          <div class="entry-header">
            <div class="entry-left">
              <span class="entry-title">${escapeHtml(t.title || "")}</span>
              ${t.organization ? `<div class="entry-subtitle">${escapeHtml(t.organization)}</div>` : ""}
            </div>
            <div class="entry-date">${escapeHtml(t.date || "")}</div>
          </div>
        </div>`).join("")}
    </div>` : "";

  const interestsSection = resume.interests?.length > 0 ? `
    <div class="section">
      <div class="section-header"><span class="sec-icon">💡</span> INTERESTS</div>
      <div class="cert-wrap">
        ${resume.interests.map(i => `<span class="cert-chip">${escapeHtml(i.name)}</span>`).join("")}
      </div>
    </div>` : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Arial', 'Helvetica', sans-serif;
    font-size: 11px;
    color: #1a1a1a;
    background: #f5f5f5;
    padding: 16px;
  }

  /* ── Colored border frame ── */
  .frame {
    background: #ffffff;
    border: 6px solid ${themeColor};
    padding: 0;
    overflow: hidden;
  }

  /* ── Header ── */
  .header {
    padding: 22px 28px 16px;
    text-align: center;
    border-bottom: 2px solid ${themeColor}20;
    position: relative;
  }
  .header-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 8px;
  }
  .photo-box {
    width: 72px; height: 72px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid ${themeColor}50;
    background: ${themeColor}12;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .photo-img { width:100%; height:100%; object-fit:cover; }
  .photo-initials { font-size: 20px; font-weight: 800; color: ${themeColor}; }
  .header-text { text-align: left; }
  .header-name { font-size: 24px; font-weight: 900; color: #1a1a1a; margin-bottom: 3px; }
  .header-title { font-size: 11px; font-style: italic; color: ${themeColor}; }

  /* Contact row centered */
  .contact-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    margin-top: 8px;
  }
  .contact-item { font-size: 9px; color: #666; display: flex; align-items: center; gap: 3px; }
  .contact-icon { color: ${themeColor}; }

  /* ── Content ── */
  .content { padding: 16px 28px; }

  /* ── Section ── */
  .section { margin-bottom: 13px; }
  .section-header {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${themeColor};
    display: flex;
    align-items: center;
    gap: 5px;
    padding-bottom: 4px;
    border-bottom: 2px solid ${themeColor};
    margin-bottom: 8px;
  }
  .sec-icon { font-size: 11px; }
  .summary-text { font-size: 10.5px; color: #444; line-height: 1.65; }

  /* ── Entry ── */
  .entry { margin-bottom: 8px; }
  .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .entry-left { flex: 1; }
  .entry-title { font-size: 11px; font-weight: 700; color: #1a1a1a; }
  .entry-subtitle { font-size: 10px; color: #666; font-style: italic; margin-top: 1px; }
  .entry-date { font-size: 9.5px; color: #888; white-space: nowrap; margin-left: 10px; }
  .entry-desc { margin-top: 3px; }
  .bullet { font-size: 10px; color: #444; margin-bottom: 2px; padding-left: 2px; line-height: 1.5; }

  /* ── Skill dots 2-column grid ── */
  .skills-dot-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px 16px;
  }
  .skill-dot-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .skill-dot-name { font-size: 10px; color: #333; }
  .skill-dots { display: flex; gap: 3px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .dot-filled { background: ${themeColor}; }
  .dot-empty { background: ${themeColor}25; border: 1px solid ${themeColor}40; }

  /* ── Cert chips ── */
  .cert-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
  .cert-chip {
    font-size: 9.5px;
    color: white;
    background: ${themeColor};
    border-radius: 4px;
    padding: 3px 10px;
  }
</style>
</head>
<body>
<div class="frame">
  <!-- Header -->
  <div class="header">
    <div class="header-top">
    ${photo ? `<div class="photo-box">
      <img src="${photo}" class="photo-img" />
    </div>` : ""}
      <div class="header-text">
        <div class="header-name">${name}</div>
        ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
      </div>
    </div>
    <div class="contact-row">
      ${email ? `<span class="contact-item"><span class="contact-icon">✉</span> ${email}</span>` : ""}
      ${phone ? `<span class="contact-item"><span class="contact-icon">✆</span> ${phone}</span>` : ""}
      ${location ? `<span class="contact-item"><span class="contact-icon">📍</span> ${location}</span>` : ""}
      ${linkedin ? `<span class="contact-item"><span class="contact-icon">in</span> ${linkedin}</span>` : ""}
      ${github ? `<span class="contact-item"><span class="contact-icon">⌥</span> ${github}</span>` : ""}
      ${website ? `<span class="contact-item"><span class="contact-icon">⊕</span> ${website}</span>` : ""}
    </div>
  </div>

  <!-- Content -->
  <div class="content">
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${languagesSection}
    ${achievementsSection}
    ${trainingSection}
    ${interestsSection}
  </div>
</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 15 — creative-portfolio
// Style: WEB WORKER reference — full-height photo/color panel on left,
//        name + contact over it, right side is clean white content
// ─────────────────────────────────────────────────────────────────────────────
function buildCreativePortfolio(resume, themeColor = "#1E3A5F") {
  const p = resume.personal || {};
  const name = escapeHtml(p.fullName) || "Your Name";
  const jobTitle = escapeHtml(p.jobTitle) || "";
  const email = escapeHtml(p.email) || "";
  const phone = escapeHtml(p.phone) || "";
  const location = escapeHtml(p.location) || "";
  const linkedin = escapeHtml(p.linkedin) || "";
  const github = escapeHtml(p.github) || "";
  const website = escapeHtml(p.website) || "";
  const summary = escapeHtml(p.summary) || "";
  const photo = p.photo || "";

  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join("");

  // ── Right column sections ──
  const summarySection = summary ? `
    <div class="section">
      <p class="summary-text">${summary}</p>
    </div>` : "";

  const experienceSection = resume.experience?.length > 0 ? `
    <div class="section">
      <div class="section-header">PROFESSIONAL EXPERIENCE</div>
      ${resume.experience.map(exp => `
        <div class="entry">
          <div class="entry-company">${escapeHtml(exp.company || exp.companyName || "")}</div>
          <div class="entry-role-line">${escapeHtml(exp.role || exp.title || "")}</div>
          <div class="entry-meta">${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}</div>
          ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const educationSection = resume.education?.length > 0 ? `
    <div class="section">
      <div class="section-header">EDUCATION</div>
      ${resume.education.map(edu => `
        <div class="entry">
          <div class="entry-company">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</div>
          <div class="entry-role-line">${escapeHtml(edu.institution || edu.school || "")}</div>
          <div class="entry-meta">${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}${edu.grade ? ` · ${escapeHtml(edu.grade)}` : ""}</div>
        </div>`).join("")}
    </div>` : "";

  // Skills as dark pill tags (like WEB WORKER)
  const skillsSection = resume.skills?.length > 0 ? `
    <div class="section">
      <div class="section-header">SKILLS</div>
      <div class="tag-wrap">
        ${resume.skills.map(s => `<span class="tag-dark">${escapeHtml(s.name)}</span>`).join("")}
      </div>
    </div>` : "";

  const languagesSection = resume.languages?.length > 0 ? `
    <div class="section">
      <div class="section-header">LANGUAGES</div>
      <div class="tag-wrap">
        ${resume.languages.map(l => `<span class="tag-light">${escapeHtml(l.name)}${l.proficiency ? ` · ${escapeHtml(l.proficiency)}` : ""}</span>`).join("")}
      </div>
    </div>` : "";

  const projectsSection = resume.projects?.length > 0 ? `
    <div class="section">
      <div class="section-header">PROJECTS</div>
      ${resume.projects.map(proj => `
        <div class="entry">
          <div class="entry-company">${escapeHtml(proj.title || "")}</div>
          ${proj.role ? `<div class="entry-role-line">${escapeHtml(proj.role)}</div>` : ""}
          ${proj.technologies ? `<div class="entry-meta">${escapeHtml(proj.technologies)}</div>` : ""}
          ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const certsSection = resume.certifications?.length > 0 ? `
    <div class="section">
      <div class="section-header">CERTIFICATIONS</div>
      <div class="tag-wrap">
        ${resume.certifications.map(c => `<span class="tag-dark">${escapeHtml(c.name)}</span>`).join("")}
      </div>
    </div>` : "";

  const achievementsSection = resume.achievements?.length > 0 ? `
    <div class="section">
      <div class="section-header">ACHIEVEMENTS</div>
      ${resume.achievements.map(a => `
        <div class="entry">
          <div class="entry-company">${escapeHtml(a.title || "")}</div>
          ${a.issuer ? `<div class="entry-role-line">${escapeHtml(a.issuer)}</div>` : ""}
          ${a.description ? `<div class="entry-desc"><div class="bullet">• ${escapeHtml(a.description)}</div></div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const trainingSection = resume.training?.length > 0 ? `
    <div class="section">
      <div class="section-header">TRAINING</div>
      ${resume.training.map(t => `
        <div class="entry">
          <div class="entry-company">${escapeHtml(t.title || "")}</div>
          ${t.organization ? `<div class="entry-role-line">${escapeHtml(t.organization)}</div>` : ""}
          ${t.date ? `<div class="entry-meta">${escapeHtml(t.date)}</div>` : ""}
        </div>`).join("")}
    </div>` : "";

  const interestsSection = resume.interests?.length > 0 ? `
    <div class="section">
      <div class="section-header">INTERESTS</div>
      <div class="tag-wrap">
        ${resume.interests.map(i => `<span class="tag-light">${escapeHtml(i.name)}</span>`).join("")}
      </div>
    </div>` : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Georgia', serif;
    font-size: 11px;
    color: #1a1a1a;
    background: #ffffff;
    display: flex;
    min-height: 100vh;
  }

  /* ── Left Panel — full height photo + overlay ── */
  .left-panel {
    width: 220px;
    min-width: 220px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  /* Background: photo if available, else themeColor gradient */
  .panel-bg {
    position: absolute;
    inset: 0;
    ${photo
      ? `background: url("${photo}") center/cover no-repeat;`
      : `background: linear-gradient(160deg, ${themeColor} 0%, ${themeColor}99 100%);`
    }
  }

  /* Dark overlay for readability */
  .panel-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      ${photo ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.10)"} 0%,
      ${photo ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.35)"} 60%,
      ${photo ? "rgba(0,0,0,0.80)" : "rgba(0,0,0,0.50)"} 100%
    );
  }

  /* Photo fallback initials when no photo */
  .panel-initials {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    font-size: 52px;
    font-weight: 900;
    color: rgba(255,255,255,0.25);
    letter-spacing: 4px;
  }

  /* Name + contact at bottom of panel */
  .panel-content {
    position: relative;
    z-index: 1;
    padding: 20px 18px 22px;
  }
  .panel-name {
    font-family: 'Georgia', serif;
    font-size: 20px;
    font-weight: 700;
    font-style: italic;
    color: #ffffff;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .panel-title {
    font-size: 9.5px;
    color: rgba(255,255,255,0.75);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .panel-divider {
    width: 32px;
    height: 2px;
    background: rgba(255,255,255,0.5);
    margin-bottom: 10px;
  }
  .panel-contact-item {
    font-size: 9px;
    color: rgba(255,255,255,0.85);
    margin-bottom: 4px;
    word-break: break-all;
  }

  /* ── Right Column ── */
  .right-col {
    flex: 1;
    padding: 22px 22px;
    background: #ffffff;
    border-left: 4px solid ${themeColor};
  }

  /* ── Section ── */
  .section { margin-bottom: 13px; }
  .section-header {
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #1a1a1a;
    border-bottom: 2px solid ${themeColor};
    padding-bottom: 3px;
    margin-bottom: 8px;
  }
  .summary-text {
    font-size: 10.5px;
    color: #444;
    line-height: 1.65;
    text-align: justify;
  }

  /* ── Entry ── */
  .entry { margin-bottom: 9px; }
  .entry-company { font-size: 11px; font-weight: 700; color: #1a1a1a; }
  .entry-role-line { font-size: 10px; font-style: italic; color: #555; margin-top: 1px; }
  .entry-meta { font-size: 9px; color: #888; margin-top: 1px; }
  .entry-desc { margin-top: 4px; }
  .bullet { font-size: 10px; color: #444; margin-bottom: 2px; padding-left: 2px; line-height: 1.5; }

  /* ── Tags ── */
  .tag-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
  .tag-dark {
    font-size: 9.5px;
    color: #ffffff;
    background: #2a2a2a;
    border-radius: 4px;
    padding: 3px 9px;
  }
  .tag-light {
    font-size: 9.5px;
    color: ${themeColor};
    background: ${themeColor}12;
    border: 1px solid ${themeColor}40;
    border-radius: 4px;
    padding: 3px 9px;
  }
</style>
</head>
<body>
<!-- Left Panel -->
<div class="left-panel">
  <div class="panel-bg"></div>
  <div class="panel-overlay"></div>
  ${!photo ? `<div class="panel-initials">${initials}</div>` : ""}
  <div class="panel-content">
    <div class="panel-name">${name.split(" ").join("<br/>")}</div>
    ${jobTitle ? `<div class="panel-title">${jobTitle}</div>` : ""}
    <div class="panel-divider"></div>
    ${location ? `<div class="panel-contact-item">📍 ${location}</div>` : ""}
    ${phone ? `<div class="panel-contact-item">✆ ${phone}</div>` : ""}
    ${email ? `<div class="panel-contact-item">✉ ${email}</div>` : ""}
    ${linkedin ? `<div class="panel-contact-item">in ${linkedin}</div>` : ""}
    ${github ? `<div class="panel-contact-item">⌥ ${github}</div>` : ""}
    ${website ? `<div class="panel-contact-item">⊕ ${website}</div>` : ""}
  </div>
</div>

<!-- Right Column -->
<div class="right-col">
  ${summarySection}
  ${experienceSection}
  ${educationSection}
  ${languagesSection}
  ${skillsSection}
  ${projectsSection}
  ${certsSection}
  ${achievementsSection}
  ${trainingSection}
  ${interestsSection}
</div>
</body>
</html>`;
}

export function getTemplate(templateId, resume, themeColor = "#1E3A5F") {
    switch (templateId) {
        case "classic-clean": return buildClassicClean(resume);
        case "classic-bold": return buildClassicBold(resume);
        // coming soon:
        case "classic-pro": return buildClassicPro(resume);
        case "classic-compact": return buildClassicCompact(resume);
        case "classic-ats": return buildClassicAts(resume);
        case "modern-executive": return buildModernExecutive(resume, themeColor);
        case "modern-analytical": return buildModernAnalytical(resume, themeColor);
        case "modern-dynamic": return buildModernDynamic(resume, themeColor);
        case "modern-minimal": return buildModernMinimal(resume, themeColor);
        case "modern-bold": return buildModernBold(resume, themeColor);
        case "creative-splash":      return buildCreativeSplash(resume, themeColor);
        case "creative-timeline":    return buildCreativeTimeline(resume, themeColor);
        case "creative-grid":        return buildCreativeGrid(resume, themeColor);
        case "creative-dark":        return buildCreativeDark(resume, themeColor);
        case "creative-portfolio":   return buildCreativePortfolio(resume, themeColor);


        default: return buildClassicClean(resume);
    }
}