'use client'

import React, { useState, useCallback, useMemo } from 'react'
import {
  Drawer,
  RenderFields,
  useField,
  useForm,
  useFormFields,
  useModal,
} from '@payloadcms/ui'
import type { ArrayFieldClientComponent, ClientField } from 'payload'
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'

function getFieldLabel(label: unknown): string {
  if (!label) return 'Item'
  if (typeof label === 'string') return label
  if (typeof label === 'object' && label !== null) {
    return (label as Record<string, string>).en || Object.values(label)[0] || 'Item'
  }
  return 'Item'
}

function getSingularLabel(label: string): string {
  if (label.endsWith(' Cases')) return label.replace(/ Cases$/, ' Case')
  if (label.endsWith(' Pillars')) return label.replace(/ Pillars$/, ' Pillar')
  if (label.endsWith(' Items')) return label.replace(/ Items$/, ' Item')
  if (label.endsWith(' Values')) return label.replace(/ Values$/, ' Value')
  if (label.endsWith('s') && !label.endsWith('ss')) return label.slice(0, -1)
  return label
}

interface ReusableContentCardProps {
  path: string
  index: number
  rowId: string
  fields: ClientField[]
  singularLabel: string
  onEdit: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  readOnly?: boolean
}

/**
 * Reusable Content Card that dynamically renders overview information
 * based on the fields present in the schema (titles, descriptions, uploads, badges).
 */
function ReusableContentCard({
  path,
  index,
  fields,
  singularLabel,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  readOnly,
}: ReusableContentCardProps) {
  // Check schema capabilities to determine appropriate visual card badges
  const hasBeforeAfterUploads = useMemo(() => {
    const names = new Set(fields.map((f) => ('name' in f ? f.name : '')))
    return names.has('beforeImage') && names.has('afterImage')
  }, [fields])

  const hasSingleUpload = useMemo(() => {
    if (hasBeforeAfterUploads) return false
    return fields.some(
      (f) => 'type' in f && f.type === 'upload' || ('name' in f && (f.name === 'image' || f.name === 'photo'))
    )
  }, [fields, hasBeforeAfterUploads])

  // Dynamically extract live field values from Payload form state
  const rowValues = useFormFields(([formFields]) => {
    const values: Record<string, unknown> = {}
    for (const f of fields) {
      if ('name' in f && f.name) {
        values[f.name] = formFields[`${path}.${index}.${f.name}`]?.value
      }
    }
    return values
  })

  // Derive meaningful title & description dynamically from schema fields
  const title = (rowValues.title ||
    rowValues.name ||
    rowValues.heading ||
    rowValues.label) as string | undefined

  const description = (rowValues.description ||
    rowValues.summary ||
    rowValues.quote ||
    rowValues.note ||
    rowValues.text) as string | undefined

  // Before & After photo status (when applicable)
  const hasBefore = Boolean(rowValues.beforeImage)
  const hasAfter = Boolean(rowValues.afterImage)
  const hasBoth = hasBefore && hasAfter

  // Single upload status (when applicable)
  const singleImageVal = hasSingleUpload
    ? Object.entries(rowValues).find(([k, v]) => k.toLowerCase().includes('image') || k.toLowerCase().includes('photo') || Boolean(v && typeof v === 'object'))?.[1]
    : null
  const hasSingleImage = Boolean(singleImageVal)

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-[#b58a48]/40 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      {/* Left Overview & Visual Metadata */}
      <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
        {/* Visual Badge 1: Before & After dual images */}
        {hasBeforeAfterUploads && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border text-[10px] font-bold ${
                hasBefore
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-neutral-100 text-neutral-400 border-dashed border-neutral-300'
              }`}
            >
              <ImageIcon className="w-4 h-4 mb-0.5" />
              <span>Before</span>
            </div>

            <span className="text-neutral-300 text-xs font-bold">&rarr;</span>

            <div
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border text-[10px] font-bold ${
                hasAfter
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-neutral-100 text-neutral-400 border-dashed border-neutral-300'
              }`}
            >
              <ImageIcon className="w-4 h-4 mb-0.5" />
              <span>After</span>
            </div>
          </div>
        )}

        {/* Visual Badge 2: Single image upload */}
        {hasSingleUpload && (
          <div
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border text-[10px] font-bold flex-shrink-0 ${
              hasSingleImage
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-neutral-100 text-neutral-400 border-dashed border-neutral-300'
            }`}
          >
            <ImageIcon className="w-4 h-4 mb-0.5" />
            <span>{hasSingleImage ? 'Uploaded' : 'Pending'}</span>
          </div>
        )}

        {/* Visual Badge 3: Pillar / Text-only record icon */}
        {!hasBeforeAfterUploads && !hasSingleUpload && (
          <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center border border-[#d8cec2] bg-[#fbf9f6] text-[#8e6e4f] flex-shrink-0">
            <Sparkles className="w-5 h-5 mb-0.5 text-[#b58a48]" />
            <span className="text-[9px] font-bold uppercase tracking-wider font-mono">#{index + 1}</span>
          </div>
        )}

        {/* Text Information (Title, Description, Meta Badges) */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#8e6e4f]/10 text-[#8e6e4f] font-mono text-xs font-bold">
              #{index + 1}
            </span>
            <h4 className="font-semibold text-neutral-900 text-base truncate">
              {title || `${singularLabel} #${index + 1}`}
            </h4>
          </div>

          {description ? (
            <p className="text-xs text-neutral-500 line-clamp-1">
              {description}
            </p>
          ) : null}

          {/* Contextual Status Badges */}
          <div className="flex items-center gap-2 pt-0.5">
            {hasBeforeAfterUploads ? (
              hasBoth ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Photos Ready
                </span>
              ) : hasBefore || hasAfter ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  1 of 2 Photos Attached
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
                  Photos Pending
                </span>
              )
            ) : hasSingleUpload ? (
              hasSingleImage ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Media Attached
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
                  Media Pending
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-50 text-neutral-600 border border-neutral-200">
                <FileText className="w-3 h-3 text-neutral-400" />
                {title ? 'Configured' : 'Draft'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls (Reorder, Delete, Edit in Drawer) */}
      <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
        {/* Reordering Controls */}
        {!readOnly && (
          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              title="Move Up"
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              title="Move Down"
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 disabled:opacity-30 disabled:pointer-events-none transition-colors border-l border-neutral-200"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Delete Row */}
        {!readOnly && (
          <button
            type="button"
            onClick={onRemove}
            title={`Delete ${singularLabel}`}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Edit in Drawer Button */}
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#8e6e4f] text-white hover:bg-[#a27e5b] shadow-sm transition-all"
        >
          <span>Edit Details</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

/**
 * Reusable Drawer Array Field Component.
 *
 * Provides a schema-driven Compact Content Card → Payload-native Side Drawer interaction.
 *
 * - Reusable across any complex repeated Array content (e.g. BeforeAfterCases, CoreValues, ContentPillars).
 * - Driven 100% by Payload's native form/field context and schema definition.
 * - Zero custom form engines, zero duplicate CRUD APIs, zero parallel validation layers.
 */
export const DrawerArrayField: ArrayFieldClientComponent = (props) => {
  const {
    field,
    path: pathFromProps,
    readOnly,
    schemaPath: schemaPathFromProps,
    permissions,
  } = props

  const path = pathFromProps || field.name
  const schemaPath = schemaPathFromProps || field.name

  const fieldLabel = useMemo(() => getFieldLabel(field.label), [field.label])
  const singularLabel = useMemo(() => getSingularLabel(fieldLabel), [fieldLabel])

  const { rows = [] } = useField<{ id: string; collapsed?: boolean }[]>({
    hasRows: true,
    path,
  })

  const { addFieldRow, removeFieldRow, moveFieldRow } = useForm()
  const { openModal, closeModal } = useModal()

  // Unique drawer slug derived safely from field path to prevent modal collisions
  const drawerSlug = useMemo(
    () => `drawer-${path.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
    [path]
  )

  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)

  const handleEdit = useCallback(
    (index: number) => {
      setActiveRowIndex(index)
      openModal(drawerSlug)
    },
    [drawerSlug, openModal]
  )

  const handleAdd = useCallback(() => {
    const nextIndex = rows.length
    addFieldRow({
      path,
      rowIndex: nextIndex,
      schemaPath,
    })
    setActiveRowIndex(nextIndex)
    openModal(drawerSlug)
  }, [addFieldRow, drawerSlug, openModal, path, rows.length, schemaPath])

  const handleRemove = useCallback(
    (index: number) => {
      removeFieldRow({
        path,
        rowIndex: index,
      })
      if (activeRowIndex === index) {
        closeModal(drawerSlug)
        setActiveRowIndex(null)
      }
    },
    [activeRowIndex, closeModal, drawerSlug, path, removeFieldRow]
  )

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index > 0) {
        moveFieldRow({
          path,
          moveFromIndex: index,
          moveToIndex: index - 1,
        })
      }
    },
    [moveFieldRow, path]
  )

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index < rows.length - 1) {
        moveFieldRow({
          path,
          moveFromIndex: index,
          moveToIndex: index + 1,
        })
      }
    },
    [moveFieldRow, path, rows.length]
  )

  const clientFields = (field.fields || []) as ClientField[]

  return (
    <div className="space-y-4 my-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>{fieldLabel}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
              {rows.length} {rows.length === 1 ? 'item' : 'items'}
            </span>
          </h3>
          {field.admin?.description ? (
            <p className="text-xs text-neutral-500 mt-0.5">
              {field.admin.description as string}
            </p>
          ) : null}
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#8e6e4f] text-white hover:bg-[#a27e5b] shadow-sm transition-all flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add {singularLabel}</span>
          </button>
        )}
      </div>

      {/* Cards List (Compact, no giant inline inputs) */}
      {rows.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
          <Sparkles className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-neutral-700">
            No {fieldLabel.toLowerCase()} added yet
          </p>
          <p className="text-xs text-neutral-400 mt-1 mb-4">
            Click the button below to add your first {singularLabel.toLowerCase()} in the side drawer.
          </p>
          {!readOnly && (
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#8e6e4f] text-white hover:bg-[#a27e5b] shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First {singularLabel}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row, idx) => (
            <ReusableContentCard
              key={row.id}
              path={path}
              index={idx}
              rowId={row.id}
              fields={clientFields}
              singularLabel={singularLabel}
              onEdit={() => handleEdit(idx)}
              onRemove={() => handleRemove(idx)}
              onMoveUp={() => handleMoveUp(idx)}
              onMoveDown={() => handleMoveDown(idx)}
              canMoveUp={idx > 0}
              canMoveDown={idx < rows.length - 1}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      {/* Reusable Payload Side Drawer for Detailed Editing */}
      <Drawer
        slug={drawerSlug}
        title={
          activeRowIndex !== null
            ? `Edit ${singularLabel} #${activeRowIndex + 1}`
            : `Edit ${singularLabel}`
        }
        className="reusable-content-drawer"
      >
        {activeRowIndex !== null && activeRowIndex < rows.length ? (
          <div className="p-6 space-y-6">
            <div className="bg-[#f7f2ec] p-4 rounded-xl border border-[#d8cec2] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#b58a48] tracking-widest block">
                  {singularLabel} Editor
                </span>
                <span className="text-sm font-semibold text-[#36302f]">
                  Editing {singularLabel} #{activeRowIndex + 1}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-white text-[#8e6e4f] border border-[#d8cec2]">
                Row {activeRowIndex + 1} of {rows.length}
              </span>
            </div>

            {/* Official Payload Field Inputs inside the Drawer */}
            <RenderFields
              fields={clientFields}
              parentPath={`${path}.${activeRowIndex}`}
              parentSchemaPath={schemaPath}
              parentIndexPath=""
              permissions={permissions === true ? permissions : permissions?.fields || {}}
              readOnly={readOnly}
              margins="small"
            />

            {/* Drawer Actions */}
            <div className="pt-6 border-t border-neutral-200 flex items-center justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={() => handleRemove(activeRowIndex)}
                className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete This {singularLabel}
              </button>

              <button
                type="button"
                onClick={() => {
                  closeModal(drawerSlug)
                  setActiveRowIndex(null)
                }}
                className="btn btn--style-primary px-6 py-2.5 rounded-xl font-semibold bg-[#8e6e4f] text-white hover:bg-[#a27e5b] text-xs shadow-sm transition-all"
              >
                Done (Save & Close Drawer)
              </button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}

// Backwards-compatible alias for any legacy imports
export const BeforeAfterDrawerField = DrawerArrayField
