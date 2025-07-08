import React from "react";

interface TopicSidebarProps {
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  currentDomainNames: string[];
  domainDisplayMapping: Record<string, string>;
  difficulty: string;
  setDifficulty: (diff: "All" | "Easy" | "Medium" | "Hard") => void;
  subject: string;
}

export const TopicSidebar: React.FC<TopicSidebarProps> = ({
  selectedDomain,
  setSelectedDomain,
  currentDomainNames,
  domainDisplayMapping,
  difficulty,
  setDifficulty,
  subject,
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "#a5d6a7";
      case "Medium": return "#ffcc80";
      case "Hard": return "#ef9a9a";
      default: return "#e0e0e0";
    }
  };

  const getDifficultyTooltip = (diff: string) => `Select ${diff} questions`;
  const getDifficultyEmoji = (diff: string) => {
    switch (diff) {
      case "Easy": return "😄";
      case "Medium": return "🤨";
      case "Hard": return "😫";
      default: return "⚪";
    }
  };

  return (
    <div style={{ width: "250px", backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", height: "fit-content" }}>
      <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", color: "#333" }}>
        <span style={{ marginLeft: "8px" }}>📖 {subject}</span>
      </div>

      <a
        href={subject === "Math" ? "/practice/english" : "/practice/math"}
        style={{
          display: 'block', padding: "6px 10px", backgroundColor: "#e3f2fd", color: "#2196f3",
          border: "1px solid #2196f3", borderRadius: "4px", cursor: "pointer", fontSize: "13px",
          textAlign: "center", textDecoration: "none", marginTop: "10px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        Go to {subject === "Math" ? "English" : "Math"} <i className="fas fa-arrow-right" style={{ marginLeft: '5px' }}></i>
      </a>

      <div style={{ height: "2px", backgroundColor: "#6e6e6e", width: "210px", margin: "20px 0" }}></div>

      <div style={{ marginBottom: "30px" }}>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Topics:</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => setSelectedDomain("All")}
            style={{
              padding: "8px 12px", backgroundColor: "#e3f2fd",
              border: selectedDomain === "All" ? "2px solid #2196f3" : "0px solid #ddd",
              borderRadius: "4px", cursor: "pointer", fontSize: "14px", textAlign: "left", color: "black",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <i className="fas fa-list" style={{ marginRight: "8px" }}></i>All Topics
          </button>
          {currentDomainNames.map((domainName) => {
            const mappedDomain = domainDisplayMapping[domainName] || domainName;
            return (
              <button
                key={domainName}
                onClick={() => setSelectedDomain(mappedDomain)}
                style={{
                  padding: "8px 12px", backgroundColor: "#e3f2fd",
                  border: selectedDomain === mappedDomain ? "2px solid #2196f3" : "0px solid #ddd",
                  borderRadius: "4px", cursor: "pointer", fontSize: "14px", textAlign: "left", color: "black",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {mappedDomain}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Choose Difficulty:</div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["All", "Easy", "Medium", "Hard"].map((diff) => (
            <div key={diff} style={{ position: "relative" }}>
              <button
                onClick={() => setDifficulty(diff as "All" | "Easy" | "Medium" | "Hard")}
                style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  border: difficulty === diff ? "3px solid #2196f3" : "2px solid #ddd",
                  backgroundColor: getDifficultyColor(diff), cursor: "pointer", fontSize: "20px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                title={getDifficultyTooltip(diff)}
              >
                {getDifficultyEmoji(diff)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};