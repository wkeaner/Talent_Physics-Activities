/**
 * Simulation Config Validator
 * Validates that a config JSON has all required fields and valid values
 * before passing it to the SimulationEngine.
 */

export function validateConfig(config) {
  const errors = []
  const warnings = []

  // --- Required top-level fields ---
  if (!config.id) errors.push("Missing 'id'")
  if (!config.version) errors.push("Missing 'version'")
  if (!config.generatedBy) errors.push("Missing 'generatedBy'")

  // --- Education ---
  if (!config.education?.concept) errors.push("Missing 'education.concept'")
  if (!config.education?.misconception) errors.push("Missing 'education.misconception'")
  if (!config.education?.correctUnderstanding) errors.push("Missing 'education.correctUnderstanding'")

  // --- Scenario ---
  if (!config.scenario?.title) errors.push("Missing 'scenario.title'")
  if (!config.scenario?.cognitiveConflict) errors.push("Missing 'scenario.cognitiveConflict'")

  // --- Physics ---
  if (!config.physics?.world) errors.push("Missing 'physics.world'")

  const allObjects = [
    ...(config.physics?.statics || []),
    ...(config.physics?.dynamics || []),
  ]

  if (allObjects.length === 0) {
    errors.push("Must have at least one physics object")
  }

  allObjects.forEach((obj, i) => {
    if (!obj.id) errors.push(`Object ${i}: missing 'id'`)
    if (!obj.type) errors.push(`Object ${i}: missing 'type'`)
    if (!obj.position) errors.push(`Object ${i}: missing 'position'`)
    if (obj.type === 'rectangle' && !obj.dimensions) {
      errors.push(`Object '${obj.id}': rectangle needs 'dimensions'`)
    }
    if (obj.type === 'circle' && !obj.radius) {
      errors.push(`Object '${obj.id}': circle needs 'radius'`)
    }
  })

  // Dynamic object physics checks
  ;(config.physics?.dynamics || []).forEach(obj => {
    if (obj.physics?.mass !== undefined && obj.physics.mass <= 0) {
      errors.push(`'${obj.id}': mass must be positive`)
    }
    if (obj.physics?.friction !== undefined && (obj.physics.friction < 0 || obj.physics.friction > 1)) {
      errors.push(`'${obj.id}': friction must be [0, 1]`)
    }
  })

  // --- Controls ---
  ;(config.controls || []).forEach((ctrl, i) => {
    if (!ctrl.id) errors.push(`Control ${i}: missing 'id'`)
    if (!ctrl.type) errors.push(`Control ${i}: missing 'type'`)
    if (!ctrl.label) errors.push(`Control ${i}: missing 'label'`)
    if (ctrl.type === 'slider' && !ctrl.range) {
      errors.push(`Control '${ctrl.id}': slider needs 'range'`)
    }
    if (ctrl.type === 'slider' && ctrl.range && ctrl.range.min >= ctrl.range.max) {
      errors.push(`Control '${ctrl.id}': range.min must < range.max`)
    }
    if (ctrl.type === 'dropdown' && (!ctrl.options || ctrl.options.length === 0)) {
      errors.push(`Control '${ctrl.id}': dropdown needs 'options'`)
    }
  })

  // --- Pedagogy ---
  if (!config.pedagogy?.predict?.prompt) errors.push("Missing 'pedagogy.predict.prompt'")
  if (!config.pedagogy?.observe?.instructions) errors.push("Missing 'pedagogy.observe.instructions'")
  if (!config.pedagogy?.explain?.prompt) errors.push("Missing 'pedagogy.explain.prompt'")

  // --- Warnings ---
  if (!config.education?.fciItem) warnings.push("No FCI item linked")
  if (!config.pedagogy?.extend?.challenge) warnings.push("No extension challenge")
  if ((config.controls || []).length < 2) warnings.push("Few controls - may lack interactivity")

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: errors.length === 0
      ? `✅ Valid (${warnings.length} warning${warnings.length !== 1 ? 's' : ''})`
      : `❌ ${errors.length} error(s), ${warnings.length} warning(s)`
  }
}
