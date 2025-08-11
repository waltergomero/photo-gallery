import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteStatus } from "@/actions/status-actions";
import { Button } from "react-bootstrap";

interface StatusButtonProps {
  id: string;
}

export function CreateStatusBtn() {
  return (
    <Link
      href="/admin/status/create"
      className="btn btn-primary"aria-label="Add new status record"
    >
      <span className="hidden md:block">Add New Status</span>{" "}
      <PlusIcon style={{ width: 16, height: 16 }} />
    </Link>
  );
}

export function UpdateStatusBtn({ id }: StatusButtonProps) {
  return (
    <Link
      href={`/admin/status/${id}`}
      className="btn btn-primary btn-sm"
      title="Edit status"
      aria-label={`Edit status ${id}`}
    >
      <span className="text-white" >Edit </span>
      <PencilIcon  style={{ width: 16, height: 16 }} />
    </Link>
  );
}

export function DeleteStatusBtn({ id }: StatusButtonProps) {
  const deleteStatusWithId = deleteStatus.bind(null, id);
  return (
    <form action={deleteStatusWithId} className="d-inline">
      <Button 
        className="btn btn-danger btn-sm" 
        type="submit"
        title="Delete status"
        aria-label={`Delete status ${id}`}
        // onClick={(e) => {
        //   if (!confirm('Are you sure you want to delete this status? This action cannot be undone.')) {
        //     e.preventDefault();
        //   }
        // }}
      ><span className="text-white" >Delete</span>
        <TrashIcon style={{ width: 16, height: 16 }} />
      </Button>
    </form>
  );
}

export function CancelStatusBtn() {
  return (
    <Link
      href="/admin/status"
      className="flex h-10 items-center rounded-lg bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
    >
      <span className="hidden md:block">Cancel</span>{" "}
      <XCircleIcon className="h-6 md:ml-4" />
    </Link>
  );
}

export function SaveStatusBtn() {
  return (
    <Button type="submit" 
    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">Save Status</span>
      <PlusIcon className="h-6 md:ml-4" />
    </Button>
  );
}
