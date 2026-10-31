export const DEVELOPER = {
  name: "Yuadhistra Hang Subba",
  role: "Full-Stack Developer",
  email: "yuadhistrahangsubba10@gmail.com",
  phone: "77857554",
  yearsOfExperience: "2+",
  college: "Gyalphoshing College of Information Technology",
  graduationYear: "2024",
  facebook: "https://www.facebook.com/ram.subba.5015",
  instagram: "https://www.instagram.com/y.d.luffy9/",
  // Drawn from the real stacks across this site and the EMIS (edu-admin-dashboard)
  // production project: microservices consumption, real-time pub/sub, and
  // container CI/CD, not just the frontend layer.
  skillGroups: [
    { title: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { title: "Backend & data", skills: ["Node.js", "PostgreSQL & Prisma", "Supabase", "Auth.js & WebAuthn"] },
    {
      title: "Infrastructure",
      skills: ["Microservices Architecture", "Docker & Kubernetes", "NATS / Real-time Systems"],
    },
  ],
} as const;
