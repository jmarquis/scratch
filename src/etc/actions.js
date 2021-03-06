import { throttle } from "lodash"
import uuid from "uuid/v4"
import { ContentState, convertToRaw } from "draft-js"
import moment from "moment"

import localData from "etc/localData"

function updateNote(noteId, noteData) {
  return {
    type: "UPDATE_NOTE",
    noteId,
    noteData
  }
}

function persistContentState(noteId, noteData) {
  localData.set(`notes.${noteId}.contentState`, noteData.contentState)
  localData.set(`notes.${noteId}.lastModified`, noteData.lastModified)
}

const throttledPersistContentState = throttle(persistContentState, 500)

export function updateContentState(noteId, contentState) {
  const noteData = {
    contentState: JSON.stringify(convertToRaw(contentState)),
    lastModified: moment()
  }
  throttledPersistContentState(noteId, noteData)
  return updateNote(noteId, noteData)
}

export function updateQuery(query) {
  return {
    type: "UPDATE_QUERY",
    query
  }
}

export function createNote(spaceId, noteId = uuid(), text) {
  const noteData = {
    spaceId,
    lastModified: moment(),
    contentState: JSON.stringify(convertToRaw(ContentState.createFromText(text || "")))
  }
  localData.set(`notes.${noteId}`, noteData)
  return updateNote(noteId, noteData)
}

export function updateFilter(filter) {
  return {
    type: "UPDATE_FILTER",
    filter
  }
}

export function toggleNoteDeleted(noteId, deleted) {
  localData.set(`notes.${noteId}.deleted`, deleted)
  return updateNote(noteId, { deleted })
}
