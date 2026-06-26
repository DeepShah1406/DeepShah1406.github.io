import { useEffect, useState } from 'react'
import { VaultShell } from './components/VaultShell'
import { NoteViewer } from './components/editor/NoteViewer'
import { GraphView } from './components/graph/GraphView'
import { useVaultStore } from './store/useVaultStore'
import { useNotes } from './hooks/useNotes'
import { LandingPage } from './pages/LandingPage'
import { SimplePage } from './pages/SimplePage'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { ArrowLeft } from 'lucide-react'

type View = 'landing' | 'simple' | 'obsidian'

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
  // Initialize view state based on session status and last page
  const [view, setView] = useState<View>(() => {
    const sessionAlive = sessionStorage.getItem('ds_session') === 'true';
    const lastPage     = localStorage.getItem('ds_last_page') as View | null;
    if (!sessionAlive) {
      // Hard refresh or first visit: always route to landing page
      return 'landing';
    }
    return lastPage || 'landing';
  });

  // Detect whether to show the loading animation:
  //   sessionStorage is wiped on hard refresh (Ctrl+F5) but survives normal F5
  //   localStorage persists across everything
  //
  //   Show animation when:
  //   - First visit ever                           (!lastPage)
  //   - Was on landing page + any refresh          (lastPage === 'landing')
  //   - Hard refresh from any page                 (!sessionAlive)
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const sessionAlive = sessionStorage.getItem('ds_session') === 'true';
    const lastPage     = localStorage.getItem('ds_last_page');
    sessionStorage.setItem('ds_session', 'true'); // mark session as active
    return !lastPage || lastPage === 'landing' || !sessionAlive;
  });

  const { notes, setNotes, theme } = useVaultStore();
  const { activeNoteId } = useNotes();

  // -- Vault data initialisation (always called - Rules of Hooks) ────────────
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

  // Track which view the user is on - used on next page load to decide animation
  useEffect(() => {
    localStorage.setItem('ds_last_page', view);
  }, [view]);

  // ── View routing (after all hooks) ────────────────────────────────────────
  if (isLoading) return (
    <LoadingScreen
      onComplete={() => setIsLoading(false)}
    />
  );
  if (view === 'landing') return <LandingPage onSelect={setView} />;
  if (view === 'simple')  return <SimplePage onBack={() => setView('landing')} />;

  // ── Obsidian vault view ───────────────────────────────────────────────────
  const activeNote = (activeNoteId && notes[activeNoteId]) || { content: '# Not Found\n\nThis note does not exist yet.' };

  return (
    <div className="relative w-full h-full">
      {/* Floating back-to-portal button */}
      <button
        onClick={() => setView('landing')}
        className="fixed bottom-5 right-5 z-[200] flex items-center gap-1.5 px-3 py-2 rounded-xl border border-obsidian-border bg-obsidian-sidebar/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-obsidian-text-muted hover:text-obsidian-accent hover:border-obsidian-accent/50 transition-all duration-300 shadow-lg group"
        title="Back to Portal"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
        Portal
      </button>

      <VaultShell>
        <NoteViewer content={activeNote.content} />
        <div className="mt-12 border-t border-obsidian-border pt-8">
          <GraphView />
        </div>
      </VaultShell>
    </div>
  )
}

export default App
