const notes = require("./notes")
const { nanoid } = require('nanoid')

const addNoteHandler = (request, h) => {
    if (!request.payload) {
        const response = h.response({
            status: 'fail',
            message: 'Payload request kosong',
        })
        response.code(400)
        return response
    }

    const { name, year, author, summary, publisher, pageCount, readPage } = request.payload

    if (!name || !year || !author || !summary || !publisher || !pageCount || !readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Data buku tidak lengkap',
        })
        response.code(400)
        return response
    }

    if (typeof pageCount !== 'number' || typeof readPage !== 'number') {
        const response = h.response({
            status: 'fail',
            message: 'Tipe data pageCount dan readPage harus number',
        })
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400)
        return response
    }

    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = pageCount === readPage
    const newNote = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, insertedAt, updatedAt,
    }

    notes.push(newNote)

    const isSuccess = notes.filter((note) => note.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        })
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    })
    response.code(500)
    return response
}

const getAllNotesHandler = (request, h) => ({
    status: 'success',
    data: {
        notes,
    },
})

const getNoteByIdHandler = (request, h) => {
    const { id }  = request.params

    const note = notes.find((n) => n.id === id)

    if (note){
        return{
            status: 'success',
             data: {
                notes,
            },
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    })
    response.code(404)
    return response
}

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload || {};

    // Check if name property is provided
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Check if readPage is not greater than pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // Find the index of the book with the provided id
    const index = notes.findIndex((note) => note.id === id);

    // If the book with the provided id is found
    if (index !== -1) {
        // Update the book details
        notes[index] = {
            ...notes[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt: new Date().toISOString(),
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        })
        response.code(200)
        return response
    }

    // If the book with the provided id is not found
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    // Find the index of the book with the provided id
    const index = notes.findIndex((note) => note.id === id);

    // If the book with the provided id is found
    if (index !== -1) {
        // Remove the book from the array
        notes.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    // If the book with the provided id is not found
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}


module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler, deleteNoteByIdHandler,}