import { useEffect } from 'react'
import { VaultShell } from './components/VaultShell'
import { NoteViewer } from './components/editor/NoteViewer'
import { GraphView } from './components/graph/GraphView'
import { useVaultStore } from './store/useVaultStore'
import { useNotes } from './hooks/useNotes'

// 00 - Identity
import deepShahContent from './vault/00-identity/Deep_Shah.md?raw'
import resumeSnapshotContent from './vault/00-identity/Resume_Snapshot.md?raw'

// 01 - Skills
import pythonContent from './vault/01-skills/Python.md?raw'
import genaiContent from './vault/01-skills/GenAI_RAG.md?raw'
import automationContent from './vault/01-skills/Automation.md?raw'
import linuxDockerContent from './vault/01-skills/Linux_Docker.md?raw'

// 02 - Builds
import railwayContent from './vault/02-builds/Railway_Safety_AI.md?raw'
import mentalHealthContent from './vault/02-builds/Mental_Health_Chatbot.md?raw'
import autismContent from './vault/02-builds/Autism_ML_Study.md?raw'
import companyRagContent from './vault/02-builds/Company_RAG_Chatbot.md?raw'
import movieRecContent from './vault/02-builds/Movie_Rec_Chatbot.md?raw'
import collegeRagContent from './vault/02-builds/College_RAG_Chatbot.md?raw'
import n8nBusinessContent from './vault/02-builds/n8n_Business_Automations.md?raw'
import underConstructionContent from './vault/02-builds/Under_Construction_Completed.md?raw'

// 03 - Logs
import experienceContent from './vault/03-logs/Experience_Log.md?raw'

// 04 - Proof
import impactContent from './vault/04-proof/Impact_Record.md?raw'
import certificationsContent from './vault/04-proof/Certifications.md?raw'

// 05 - Access
import contactContent from './vault/05-access/Contact_Node.md?raw'

function App() {
  const { notes, setNotes, theme } = useVaultStore();
  const { activeNoteId } = useNotes();

  useEffect(() => {
    // Apply persisted theme on load
    if (theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }

    setNotes({
      'deep_shah': {
        id: 'deep_shah',
        title: 'Deep Shah',
        content: deepShahContent,
        folder: '00 - Identity',
        tags: ['#ai', '#ml', '#automation']
      },
      'resume_snapshot': {
        id: 'resume_snapshot',
        title: 'Resume Snapshot',
        content: resumeSnapshotContent,
        folder: '00 - Identity',
        tags: ['#resume', '#overview']
      },
      'python': {
        id: 'python',
        title: 'Python & CV',
        content: pythonContent,
        folder: '01 - Skills',
        tags: ['#python', '#opencv', '#yolo']
      },
      'genai_rag': {
        id: 'genai_rag',
        title: 'GenAI & RAG',
        content: genaiContent,
        folder: '01 - Skills',
        tags: ['#llm', '#rag', '#langchain']
      },
      'automation': {
        id: 'automation',
        title: 'Automation & Orchestration',
        content: automationContent,
        folder: '01 - Skills',
        tags: ['#n8n', '#automation']
      },
      'linux_docker': {
        id: 'linux_docker',
        title: 'Linux & Docker',
        content: linuxDockerContent,
        folder: '01 - Skills',
        tags: ['#linux', '#docker', '#devops']
      },
      'railway_safety_ai': {
        id: 'railway_safety_ai',
        title: 'Railway Safety AI',
        content: railwayContent,
        folder: '02 - Builds',
        tags: ['#cv', '#ai', '#safety']
      },
      'mental_health_chatbot': {
        id: 'mental_health_chatbot',
        title: 'Mental Health Chatbot',
        content: mentalHealthContent,
        folder: '02 - Builds',
        tags: ['#mental-health', '#rag', '#flask']
      },
      'autism_ml_study': {
        id: 'autism_ml_study',
        title: 'Autism ML Study',
        content: autismContent,
        folder: '02 - Builds',
        tags: ['#ml', '#healthcare', '#xgboost']
      },
      'company_rag_chatbot': {
        id: 'company_rag_chatbot',
        title: 'Company RAG Chatbot',
        content: companyRagContent,
        folder: '02 - Builds',
        tags: ['#corporate', '#rag', '#fastapi']
      },
      'movie_rec_chatbot': {
        id: 'movie_rec_chatbot',
        title: 'Movie Rec Chatbot',
        content: movieRecContent,
        folder: '02 - Builds',
        tags: ['#recommender', '#llm', '#api']
      },
      'college_rag_chatbot': {
        id: 'college_rag_chatbot',
        title: 'College RAG Chatbot',
        content: collegeRagContent,
        folder: '02 - Builds',
        tags: ['#education', '#rag', '#ocr']
      },
      'n8n_business_automations': {
        id: 'n8n_business_automations',
        title: 'n8n Business Automations',
        content: n8nBusinessContent,
        folder: '02 - Builds',
        tags: ['#automation', '#n8n', '#efficiency']
      },
      'under_construction_completed': {
        id: 'under_construction_completed',
        title: 'Under Construction Completed',
        content: underConstructionContent,
        folder: '02 - Builds',
        tags: ['#archive', '#legacy', '#history']
      },
      'experience_log': {
        id: 'experience_log',
        title: 'Experience Log',
        content: experienceContent,
        folder: '03 - Logs',
        tags: ['#experience', '#career', '#history']
      },
      'impact_record': {
        id: 'impact_record',
        title: 'Impact Record',
        content: impactContent,
        folder: '04 - Proof',
        tags: ['#impact', '#metrics', '#achievements']
      },
      'certifications': {
        id: 'certifications',
        title: 'Certifications',
        content: certificationsContent,
        folder: '04 - Proof',
        tags: ['#awards', '#education', '#certs']
      },
      'contact_node': {
        id: 'contact_node',
        title: 'Contact Node',
        content: contactContent,
        folder: '05 - Access',
        tags: ['#contact', '#social', '#terminal']
      }
    });
  }, [setNotes, theme]);

  const activeNote = (activeNoteId && notes[activeNoteId]) || { content: '# Not Found\n\nThis note does not exist yet.' };

  return (
    <VaultShell>
      <NoteViewer content={activeNote.content} />
      <div className="mt-12 border-t border-obsidian-border pt-8">
        <GraphView />
      </div>
    </VaultShell>
  )
}

export default App
