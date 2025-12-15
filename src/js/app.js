// Load version content dynamically
async function loadVersionContent(commitHash) {
  const contentViewer = document.getElementById('content-viewer');
  const contentDisplay = document.getElementById('content-display');

  try {
    contentDisplay.innerHTML = '<p>Loading...</p>';
    contentViewer.style.display = 'block';

    const response = await fetch(`/api/versions/${commitHash}/content`);
    const data = await response.json();

    if (data.content) {
      contentDisplay.textContent = data.content;
    } else {
      contentDisplay.innerHTML = '<p style="color: #ef4444;">Failed to load content</p>';
    }
  } catch (error) {
    console.error('Error loading content:', error);
    contentDisplay.innerHTML = '<p style="color: #ef4444;">Error loading content</p>';
  }
}

// Load diff between versions
async function loadDiff(fromHash, toHash) {
  try {
    const response = await fetch(`/api/diff/${fromHash}/${toHash}`);
    const data = await response.json();

    console.log('Diff:', data.diff);
    return data.diff;
  } catch (error) {
    console.error('Error loading diff:', error);
    return null;
  }
}

// Copy commit hash to clipboard
function copyCommitHash(hash) {
  navigator.clipboard.writeText(hash).then(() => {
    // Show temporary "Copied!" message
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('🛡️ Disruption OS Version Control System loaded');

  // Add copy-to-clipboard functionality to commit hashes
  const commitHashes = document.querySelectorAll('.commit-hash');
  commitHashes.forEach((hash) => {
    hash.style.cursor = 'pointer';
    hash.title = 'Click to copy';
    hash.addEventListener('click', () => {
      copyCommitHash(hash.textContent);
    });
  });
});
