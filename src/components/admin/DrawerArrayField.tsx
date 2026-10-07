'use client'

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
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
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Image as ImageIcon,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react'

// Local scoped stylesheet strictly for DrawerArrayField
import './DrawerArrayField.scss'

/* ==========================================================================
   Helpers
   ========================================================================== */

function getFieldLabel(label: unknown): string {
  if (!label) return 'Item'
  if (typeof label === 'string') return label
  if (typeof label === 'object' && label !== null) {
    return (label as Record<string, string>).en || Object.values(label)[0] || 'Item'
  }
  return 'Item'
}

function getSingularLabel(label: string): string {
  if (label.includes('Pillars')) return 'Pillar'
  if (label.includes('Values')) return 'Value'
  if (label.includes('Cases')) return 'Case'
  if (label.includes('Items')) return 'Item'
  if (label.endsWith(' Cases')) return label.replace(/ Cases$/, ' Case')
  if (label.endsWith(' Pillars')) return label.replace(/ Pillars$/, ' Pillar')
  if (label.endsWith(' Items')) return label.replace(/ Items$/, ' Item')
  if (label.endsWith(' Values')) return label.replace(/ Values$/, ' Value')
  if (label.endsWith('s') && !label.endsWith('ss')) return label.slice(0, -1)
  return label
}

const mediaUrlCache = new Map<string | number, string>()

function getDirectMediaUrl(val: unknown): string | null {
  if (!val) return null
  if (typeof val === 'object' && val !== null) {
    if ('url' in val && typeof (val as Record<string, unknown>).url === 'string') {
      return (val as Record<string, unknown>).url as string
    }
    if ('filename' in val && typeof (val as Record<string, unknown>).filename === 'string') {
      return `/media/${(val as Record<string, unknown>).filename}`
    }
  }
  const id = typeof val === 'object' && val !== null && 'id' in val ? (val as Record<string, unknown>).id : val
  if ((typeof id === 'string' || typeof id === 'number') && mediaUrlCache.has(id)) {
    return mediaUrlCache.get(id)!
  }
  return null
}

/**
 * Resolves a Media field value (either populated object or ID) into a displayable thumbnail URL.
 */
function useResolvedMediaUrl(val: unknown): string | null {
  const directUrl = getDirectMediaUrl(val)
  const [asyncUrl, setAsyncUrl] = useState<string | null>(null)

  const id = typeof val === 'object' && val !== null && 'id' in val ? (val as Record<string, unknown>).id : val

  useEffect(() => {
    if (!id || directUrl) return
    const idKey = id as string | number
    if (mediaUrlCache.has(idKey)) return

    let isMounted = true
    fetch(`/api/media/${idKey}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (!isMounted) return
        if (doc?.url) {
          mediaUrlCache.set(idKey, doc.url)
          setAsyncUrl(doc.url)
        } else if (doc?.filename) {
          const direct = `/media/${doc.filename}`
          mediaUrlCache.set(idKey, direct)
          setAsyncUrl(direct)
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [id, directUrl])

  return directUrl || asyncUrl
}

/* ==========================================================================
   Reusable Content Card Component
   ========================================================================== */

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
  // Action Menu dropdown state
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  // Check schema capabilities to determine visual preview
  const hasBeforeAfterUploads = useMemo(() => {
    const names = new Set(fields.map((f) => ('name' in f ? f.name : '')))
    return names.has('beforeImage') && names.has('afterImage')
  }, [fields])

  const hasSingleUpload = useMemo(() => {
    if (hasBeforeAfterUploads) return false
    return fields.some(
      (f) =>
        ('type' in f && f.type === 'upload') ||
        ('name' in f && (f.name === 'image' || f.name === 'photo'))
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

  // Resolve thumbnail URLs
  const beforeUrl = useResolvedMediaUrl(rowValues.beforeImage)
  const afterUrl = useResolvedMediaUrl(rowValues.afterImage)

  const hasBefore = Boolean(beforeUrl || rowValues.beforeImage)
  const hasAfter = Boolean(afterUrl || rowValues.afterImage)
  const hasBoth = hasBefore && hasAfter

  // Single upload resolution
  const singleImageVal = hasSingleUpload
    ? Object.entries(rowValues).find(
        ([k, v]) =>
          k.toLowerCase().includes('image') ||
          k.toLowerCase().includes('photo') ||
          Boolean(v && typeof v === 'object')
      )?.[1]
    : null
  const singleUrl = useResolvedMediaUrl(singleImageVal)

  // Check if this item is a simple word-only / pillar item (e.g. keysToSuccessPillars)
  const isWordOnly = useMemo(() => {
    return (
      !hasBeforeAfterUploads &&
      !hasSingleUpload &&
      !description &&
      (fields.length <= 1 || singularLabel.toLowerCase().includes('pillar'))
    )
  }, [hasBeforeAfterUploads, hasSingleUpload, description, fields.length, singularLabel])

  // Formatted 2-digit sequence for clean presentation (e.g. 01, 02)
  const sequenceStr = String(index + 1).padStart(2, '0')

  return (
    <div
      className={`drawer-array-field__card ${isWordOnly ? 'is-word-only' : ''} ${menuOpen ? 'is-menu-open' : ''}`}
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onEdit()
        }
      }}
      aria-label={`Edit ${title || `${singularLabel} #${index + 1}`}`}
    >
      {/* 1. Left Visual Preview */}
      {hasBeforeAfterUploads && (
        <div className="drawer-array-field__dual-thumbnails" aria-hidden="true">
          {/* Before Thumbnail */}
          <div className="drawer-array-field__thumbnail-half">
            {beforeUrl ? (
              <img src={beforeUrl} alt="Before treatment" />
            ) : (
              <div className="drawer-array-field__thumbnail-placeholder">
                <ImageIcon style={{ width: 14, height: 14, opacity: 0.6 }} />
                <span>Before</span>
              </div>
            )}
          </div>

          {/* After Thumbnail */}
          <div className="drawer-array-field__thumbnail-half is-after">
            {afterUrl ? (
              <img src={afterUrl} alt="After treatment" />
            ) : (
              <div className="drawer-array-field__thumbnail-placeholder">
                <ImageIcon style={{ width: 14, height: 14, opacity: 0.6 }} />
                <span>After</span>
              </div>
            )}
          </div>

          {/* Center Divider Arrow */}
          <div className="drawer-array-field__divider-arrow">
            <ArrowRight style={{ width: 11, height: 11 }} />
          </div>
        </div>
      )}

      {hasSingleUpload && (
        <div className="drawer-array-field__single-thumbnail" aria-hidden="true">
          {singleUrl ? (
            <img src={singleUrl} alt={title || 'Attached Media'} />
          ) : (
            <div className="drawer-array-field__thumbnail-placeholder">
              <ImageIcon style={{ width: 18, height: 18, opacity: 0.6 }} />
              <span>Media</span>
            </div>
          )}
        </div>
      )}

      {!hasBeforeAfterUploads && !hasSingleUpload && (
        isWordOnly ? (
          <div className="drawer-array-field__compact-badge" aria-hidden="true">
            <span>{sequenceStr}</span>
          </div>
        ) : (
          <div className="drawer-array-field__sequence-badge" aria-hidden="true">
            <span>{sequenceStr}</span>
          </div>
        )
      )}

      {/* 2. Middle Content Info */}
      <div className="drawer-array-field__card-content">
        <h4 className="drawer-array-field__card-title">
          {title || `${singularLabel} #${index + 1}`}
        </h4>

        {/* Status Row with semantic dots (only show for media items or when description exists) */}
        {!isWordOnly && (hasBeforeAfterUploads || hasSingleUpload || description) && (
          <div className="drawer-array-field__status-row">
            {hasBeforeAfterUploads ? (
              hasBoth ? (
                <>
                  <span className="drawer-array-field__status-dot dot-ready" />
                  <span className="drawer-array-field__status-text text-ready">Photos Ready</span>
                </>
              ) : hasBefore && !hasAfter ? (
                <>
                  <span className="drawer-array-field__status-dot dot-warning" />
                  <span className="drawer-array-field__status-text text-warning">Missing After Photo</span>
                </>
              ) : !hasBefore && hasAfter ? (
                <>
                  <span className="drawer-array-field__status-dot dot-warning" />
                  <span className="drawer-array-field__status-text text-warning">Missing Before Photo</span>
                </>
              ) : (
                <>
                  <span className="drawer-array-field__status-dot dot-pending" />
                  <span className="drawer-array-field__status-text text-pending">Photos Pending</span>
                </>
              )
            ) : hasSingleUpload ? (
              singleUrl ? (
                <>
                  <span className="drawer-array-field__status-dot dot-ready" />
                  <span className="drawer-array-field__status-text text-ready">Media Ready</span>
                </>
              ) : (
                <>
                  <span className="drawer-array-field__status-dot dot-pending" />
                  <span className="drawer-array-field__status-text text-pending">Media Pending</span>
                </>
              )
            ) : (
              <>
                <span className="drawer-array-field__status-dot dot-ready" />
                <span className="drawer-array-field__status-text text-ready">
                  {title ? 'Configured' : 'Draft'}
                </span>
              </>
            )}
          </div>
        )}

        {!isWordOnly && description ? (
          <p className="drawer-array-field__card-snippet">{description}</p>
        ) : null}
      </div>

      {/* 3. Right: Meta & Actions */}
      <div className="drawer-array-field__meta-actions">
        {/* Index label (only when not word-only) */}
        {!isWordOnly && (
          <span className="drawer-array-field__index-label">#{index + 1}</span>
        )}

        {/* More Actions Overflow Menu */}
        {!readOnly && (
          <div
            className="drawer-array-field__menu-wrapper"
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="drawer-array-field__menu-trigger"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={`Actions for ${title || `${singularLabel} #${index + 1}`}`}
              title="More actions"
            >
              <MoreHorizontal style={{ width: 18, height: 18 }} />
            </button>

            {menuOpen && (
              <div className="drawer-array-field__menu-dropdown">
                <button
                  type="button"
                  className="drawer-array-field__menu-item"
                  onClick={() => {
                    onMoveUp()
                    setMenuOpen(false)
                  }}
                  disabled={!canMoveUp}
                >
                  <ArrowUp style={{ width: 14, height: 14 }} />
                  <span>Move Up</span>
                </button>

                <button
                  type="button"
                  className="drawer-array-field__menu-item"
                  onClick={() => {
                    onMoveDown()
                    setMenuOpen(false)
                  }}
                  disabled={!canMoveDown}
                >
                  <ArrowDown style={{ width: 14, height: 14 }} />
                  <span>Move Down</span>
                </button>

                <div
                  style={{
                    height: 1,
                    backgroundColor: 'var(--theme-elevation-200, rgba(255, 255, 255, 0.08))',
                    margin: '4px 0',
                  }}
                />

                <button
                  type="button"
                  className="drawer-array-field__menu-item is-delete"
                  onClick={() => {
                    onRemove()
                    setMenuOpen(false)
                  }}
                >
                  <Trash2 style={{ width: 14, height: 14 }} />
                  <span>Delete {singularLabel}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right Chevron indicating clickability */}
        <div className="drawer-array-field__chevron">
          <ChevronRight style={{ width: 18, height: 18 }} />
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   Main Reusable DrawerArrayField Component
   ========================================================================== */

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

  const rawFieldLabel = useMemo(() => getFieldLabel(field.label), [field.label])
  // Strip redundant internal phrasing if present
  const fieldLabel = useMemo(() => {
    return rawFieldLabel
      .replace(/Photo Showcase Cases/i, 'Cases')
      .replace(/Showcase Cases/i, 'Cases')
      .trim()
  }, [rawFieldLabel])

  const singularLabel = useMemo(() => getSingularLabel(fieldLabel), [fieldLabel])

  const { rows = [] } = useField<{ id: string; collapsed?: boolean }[]>({
    hasRows: true,
    path,
  })

  const { addFieldRow, removeFieldRow, moveFieldRow } = useForm()
  const { openModal, closeModal } = useModal()

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

  const countUnit = useMemo(() => {
    const lower = singularLabel.toLowerCase()
    if (rows.length === 1) return lower
    if (lower.endsWith('s')) return lower
    return `${lower}s`
  }, [singularLabel, rows.length])

  return (
    <div className="drawer-array-field">
      {/* Header Area */}
      <div className="drawer-array-field__header">
        <div className="drawer-array-field__title-group">
          <div className="drawer-array-field__title-row">
            <h3 className="drawer-array-field__title">{fieldLabel}</h3>
            <span className="drawer-array-field__count-pill">
              {rows.length} {countUnit}
            </span>
          </div>
          {field.admin?.description ? (
            <p className="drawer-array-field__description">
              {field.admin.description as string}
            </p>
          ) : null}
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={handleAdd}
            className="drawer-array-field__add-btn"
          >
            <Plus style={{ width: 16, height: 16 }} />
            <span>Add {singularLabel}</span>
          </button>
        )}
      </div>

      {/* Cards List */}
      {rows.length === 0 ? (
        <div className="drawer-array-field__empty-state">
          <ImageIcon style={{ width: 36, height: 36, color: 'var(--theme-elevation-400, #475569)' }} />
          <h4 className="drawer-array-field__empty-title">
            No {fieldLabel.toLowerCase()} added yet
          </h4>
          <p className="drawer-array-field__empty-text">
            Click the button below to create your first {singularLabel.toLowerCase()} in the side drawer.
          </p>
          {!readOnly && (
            <button
              type="button"
              onClick={handleAdd}
              className="drawer-array-field__add-btn"
            >
              <Plus style={{ width: 16, height: 16 }} />
              <span>Add First {singularLabel}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="drawer-array-field__cards-list">
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

      {/* Polished Side Drawer */}
      <Drawer
        slug={drawerSlug}
        title={
          activeRowIndex !== null
            ? `Edit ${singularLabel} #${activeRowIndex + 1}`
            : `Edit ${singularLabel}`
        }
        className="drawer-array-field__drawer"
      >
        {activeRowIndex !== null && activeRowIndex < rows.length ? (
          <div className="drawer-array-field__drawer-body">
            {/* Banner info */}
            <div className="drawer-array-field__drawer-banner">
              <div>
                <span
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#b58a48', // Clinic Primary Gold
                    display: 'block',
                  }}
                >
                  Clinical Content Editor
                </span>
                <span className="drawer-array-field__drawer-banner-title">
                  Editing {singularLabel} #{activeRowIndex + 1}
                </span>
              </div>
              <span className="drawer-array-field__drawer-banner-pill">
                {singularLabel} {activeRowIndex + 1} of {rows.length}
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

            {/* Sticky/Polished Footer Actions */}
            <div className="drawer-array-field__drawer-footer">
              <button
                type="button"
                onClick={() => handleRemove(activeRowIndex)}
                className="drawer-array-field__btn-delete"
              >
                Delete This {singularLabel}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    closeModal(drawerSlug)
                    setActiveRowIndex(null)
                  }}
                  className="drawer-array-field__btn-cancel"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeModal(drawerSlug)
                    setActiveRowIndex(null)
                  }}
                  className="drawer-array-field__btn-done"
                >
                  Done (Save & Close)
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}

// Backwards-compatible alias for any legacy imports
export const BeforeAfterDrawerField = DrawerArrayField
