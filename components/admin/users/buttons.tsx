import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteUser } from "@/actions/user-actions";
import { Button } from "react-bootstrap";

interface UsersButtonProps {
  id: string;
}

export function CreateUserBtn() {
  return (
    <Link
      href="/admin/users/create"
      className="btn btn-primary"aria-label="Add new user"
    >
      <span className="hidden md:block">Add New User</span>{" "}
      <PlusIcon style={{ width: 16, height: 16 }} />
    </Link>
  );
}

export function UpdateUserBtn({ id }: UsersButtonProps) {
  return (
    <Link
      href={`/admin/users/${id}`}
      className="btn btn-primary btn-sm"
      title="Edit user"
      aria-label={`Edit user ${id}`}
    >
      <span className="text-white" >Edit </span>
      <PencilIcon  style={{ width: 16, height: 16 }} />
    </Link>
  );
}

export function DeleteUserBtn({ id }: UsersButtonProps) {
  const deleteUserWithId = deleteUser.bind(null, id);
  return (
    <form action={deleteUserWithId} className="d-inline">
      <Button
        className="btn btn-danger btn-sm"
        type="submit"
        title="Delete user"
        aria-label={`Delete user ${id}`}
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
