import React from "react";

export type ChildrenType = Readonly<{ children: React.ReactNode }>

// Re-export status types for easier imports
export * from './status';
export * from './category';