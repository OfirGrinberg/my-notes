const inp = document.querySelector('textarea')
const date = document.querySelector('#date')
const saveBtn = document.querySelector('#btn-save')
const clearBtn = document.querySelector('#btn-clear')
const list = document.querySelector('ul')

// functions:
const clear = () => (inp.value = '')
const noteId = () => Math.random().toString().split('.')[1]
date.valueAsDate = new Date()
const fixedDate = () => date.value.split('-').reverse().join('/')
const save = () => {
	const val = inp.value
	if (val === '') {
		return alert('Please write a task.')
	}
	const id = noteId()
	newNote(id, val, fixedDate())
	saveToLocalStorage(id, [val, fixedDate()])
	clear()
}
const newNote = (id, text, time) => {
	list.innerHTML += `
		<div class="note fade-in" id="${id}">
			<li class="note-item">
				<div class="note-header">
					<span class="icon" id="${id}">
						<i class="fas fa-times-circle"></i>
					</span>
					</div>
				<div class="note-main">${text}</div>
				<div class="note-footer">${time}</div>
			</li>
		</div>`
	const note = document.getElementById(id)
	setTimeout(
		() => (note.style.opacity = 1 && note.classList.remove('fade-in')),
		1500
	)
	const icon = document.querySelectorAll('.icon')
	icon.forEach(element => {
		element.addEventListener('click', () => {
			const noteDiv = element.closest('.note')
			noteDiv.classList.add('fade-out')
			removeNote(element.id)
			setTimeout(() => noteDiv.remove(), 1500)
		})
	})
}
const checkLocalStorage = () => {
	let notesIds
	const getNotesIds = localStorage.getItem('notes-ids')
	getNotesIds ? (notesIds = JSON.parse(getNotesIds)) : (notesIds = [])
	return notesIds
}
const saveToLocalStorage = (id, [input, time]) => {
	let notesIds = checkLocalStorage()
	notesIds.push(id)
	notesIds = JSON.stringify(notesIds)
	localStorage.setItem('notes-ids', notesIds)
	localStorage.setItem(id, [input, time])
}
const getNotes = () => {
	const notesIds = checkLocalStorage()
	for (let notesId of notesIds) {
		let noteContent = JSON.stringify(localStorage.getItem(notesId))
		noteContent = JSON.parse(noteContent).split(',')
		newNote(notesId, noteContent[0], noteContent[1])
	}
}
const removeNote = id => {
	let notesIds = checkLocalStorage()
	const i = notesIds.indexOf(id)
	notesIds.splice(i, 1)
	notesIds = JSON.stringify(notesIds)
	localStorage.setItem('notes-ids', notesIds)
	localStorage.removeItem(id)
}

// event listners:
clearBtn.addEventListener('click', clear)
saveBtn.addEventListener('click', save)
window.addEventListener('load', getNotes)