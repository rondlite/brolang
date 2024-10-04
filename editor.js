  const editor = document.getElementById('codeInput');
    const lineNumbers = document.getElementById('lineNumbers');

    function updateLineNumbers() {
      const lines = editor.value.split('\n');
      const lineCount = lines.length;
      
      lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => 
        `<span>${i + 1}</span>`
      ).join('');
      
      // Adjust textarea height to match content
      editor.style.height = 'auto';
      editor.style.height = editor.scrollHeight + 'px';
    }

    editor.addEventListener('input', updateLineNumbers);
    editor.addEventListener('scroll', () => {
      lineNumbers.scrollTop = editor.scrollTop;
    });

    // Initialize with one line number
    updateLineNumbers();
