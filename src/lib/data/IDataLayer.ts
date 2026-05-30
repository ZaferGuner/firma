export interface IDataLayer {
  /**
   * Fetch the active, public-facing published content for a given page and section.
   */
  getSectionContent(pageKey: string, sectionKey: string): Promise<any | null>;

  /**
   * Fetch the current active draft content for a given page and section.
   * If no draft exists for this section, it should fallback to the published content.
   */
  getDraftContent(pageKey: string, sectionKey: string): Promise<any | null>;

  /**
   * Autosave changes to the draft table. This does NOT update the public-facing section.
   */
  saveDraftContent(pageKey: string, sectionKey: string, data: any): Promise<void>;

  /**
   * Atomic Transaction Commit:
   * Merges all active drafts (from ContentDrafts) into the public-facing ContentSections table.
   * If any merge fails, the entire transaction is rolled back.
   * After success, clears the drafts table.
   */
  commitDrafts(): Promise<void>;

  /**
   * Discards all current active drafts, clearing the drafts database.
   */
  discardDrafts(): Promise<void>;

  /**
   * Fetch the admin user record by email for authentication verification.
   */
  getAdminUser(email: string): Promise<{ id: string; email: string; passwordHash: string } | null>;

  /**
   * Fetch all published projects.
   * If onlyPublished is false, returns all projects (for admin listing).
   */
  getProjects(onlyPublished?: boolean): Promise<any[]>;

  /**
   * Fetch all project draft states (falls back to published if no draft).
   */
  getProjectsDrafts(): Promise<any[]>;

  /**
   * Fetch a single project by its unique slug.
   */
  getProjectBySlug(slug: string): Promise<any | null>;

  /**
   * Fetch a single project draft by slug (falls back to published if no draft).
   */
  getProjectDraft(slug: string): Promise<any | null>;

  /**
   * Autosave project modifications to the drafts database.
   */
  saveProjectDraft(slug: string, data: any): Promise<void>;

  /**
   * Insert a new project record, checking for slug uniqueness.
   */
  addProject(project: any): Promise<void>;

  /**
   * Fetch all public press items. If onlyPublished is true, returns only published items.
   */
  getPressItems(onlyPublished?: boolean): Promise<any[]>;

  /**
   * Fetch the active press item draft list, falling back to published items.
   */
  getPressDrafts(): Promise<any[]>;

  /**
   * Autosave a press item draft. This is intentionally separate from project drafts.
   */
  savePressDraft(id: string, data: any): Promise<void>;

  /**
   * Add a new press item as an unpublished draft.
   */
  addPressItem(item: any): Promise<any>;

  /**
   * Fetch all inquiries.
   */
  getInquiries(): Promise<any[]>;

  /**
   * Add a new inquiry (real save, no draft logic).
   */
  addInquiry(inquiry: any): Promise<void>;

  /**
   * Update an existing inquiry (e.g. status or notes).
   */
  updateInquiry(id: string, updates: any): Promise<void>;

  /**
   * Perform initial checks and seed the database using environment variables if empty.
   * Raises an error and halts execution if environment variables are missing.
   */
  seedDatabase(): Promise<void>;
}
