//MathJax initialization
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  }
};

let currentMatrixInput = null;

function generate_matrix() {
    let generated_matrix = document.getElementById('generated_matrix');
    let rows = document.getElementById('rows').value;
    let cols = document.getElementById('cols').value;
    generated_matrix.innerHTML = "";

    //create table element
    let table = document.createElement('table')
    let tbody = document.createElement('tbody');
    table.style.borderCollapse = 'collapse';

    //row and column generation
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            td.style.border = '1px solid black'; 
            td.style.padding = '4px'; 
            td.style.textAlign = 'center';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = "a"+(i+1)+(j+1); //placeholder value

            //call resize input width
            input.addEventListener('input', resizeInput);
            input.oninput = () => generate_latex();
            resizeInput.call(input);

            input.addEventListener('focus', () => currentMatrixInput = input)

            td.appendChild(input);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    generated_matrix.appendChild(table);
}
//resize matrix cells
function resizeInput() {
    if (this.value.length == 0) {
        this.style.width = (this.placeholder.length+1) + 'ch';
    } else {
        this.style.width = (this.value.length+1) + 'ch';
    }
};

//latex simulation
function generate_latex() {
    const matrix = generated_matrix.querySelector('table');
    let copypaste = document.getElementById('copypaste');
    let matrix_type = document.getElementById('matrix_type');
    let latex = "$\\begin{"+matrix_type.value+"}\n";
    let view_latex = document.getElementById('view_latex');
    let view_latex_label = document.createElement('label');
    view_latex_label.textContent = 'Simulated Latex';
    
    //matrix entries to latex
    let rows = matrix.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
        let cols = rows[i].children;
        let row_list = [];
        //loop through each column in the row
        for (let j = 0; j < cols.length; j++) {
            let cell = cols[j].children[0];
            row_list.push(cell.value); 
        }
        latex += row_list.join(" & ");

        if (i == rows.length - 1) {
            latex += "\n";
        } else {
            latex += " \\\\\n";
        }
    }
    latex += "\\end{"+matrix_type.value+"}$"
    copypaste.value = latex;
    view_latex.innerHTML = latex;
    MathJax.typeset();
    view_latex.prepend(view_latex_label);
    
};

//button input
function insertValue(val) {
  if (!currentMatrixInput) return;

  // get caret position
  const start = currentMatrixInput.selectionStart;
  const end   = currentMatrixInput.selectionEnd;
  const old   = currentMatrixInput.value;

  // insert `val` at the caret
  currentMatrixInput.value = old.slice(0, start) + val + old.slice(end);

  // move caret just after the inserted text
  const newPos = start + val.length;
  currentMatrixInput.setSelectionRange(newPos, newPos);

  // resize & re-render LaTeX
  resizeInput.call(currentMatrixInput);
  generate_latex();

  // keep focus there
  currentMatrixInput.focus();
}
//DOM load
document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('#extra_functions button').forEach(btn => {
        btn.addEventListener('click', () => {
          insertValue(btn.getAttribute('value'));
        });
    });
});