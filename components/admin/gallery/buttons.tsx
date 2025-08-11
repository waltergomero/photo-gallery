import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon, EyeIcon, EyeSlashIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteImageFromGallery, MakeImageNotVisible, MakeImageVisible, MakeAllImageVisible, 
  MakeAllImageNotVisible, MakeAllImageVisibility } from "@/actions/gallery-actions";
import { Button } from "react-bootstrap";

type DeleteImageBtnProps = {
  image_id: string;
  image_src: string;
};

export function DeleteImageBtn({ image_id, image_src }: DeleteImageBtnProps) {
  const deleteImageId = deleteImageFromGallery.bind(null, image_id, image_src);
  return (
    <form action={deleteImageId}>
      <Button className="btn btn-sm btn-danger" type="submit"  style={{ top: 0, right: 0, zIndex: 2, position: 'absolute'}} >
        X
      </Button>
    </form>
  );
}


type SetImageVisibleProps = {
  image_id: string;
  user_email: string;
};

export function SetImageVisible({ image_id, user_email }: SetImageVisibleProps) {
  const makeImageVisible = MakeImageVisible.bind(null, image_id, user_email);
  return (
    <form action={makeImageVisible}>
      <button className="absolute top-8 right-0 rounded-sm bg-gray-400">
        <EyeSlashIcon className="w-6 text-white" />
      </button>
    </form>
  );
}

type SetImageNotVisibleProps = {
  image_id: string;
  image_src: string;
};

export function SetImageNotVisible({ image_id, image_src }: SetImageNotVisibleProps) {
  const makeImageNotVisble = MakeImageNotVisible.bind(null, image_id, image_src);
  return (
    <form action={makeImageNotVisble}>
      <button className="absolute top-8 right-0 rounded-sm bg-blue-500">
        <EyeIcon className="w-6 text-white" />
      </button>
    </form>
  );
}


export function EditImageBtn({id}: {id: string}) {
  return (
    <Link href={`/admin/gallery/${id}/edit`} className="absolute top-15 right-0 rounded-sm bg-green-400">
    <PencilIcon className="w-6 text-white" />
  </Link>

  );
}


export function SaveImageBtn() {
  return (
    <Button type="submit"
    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">Save Images</span>
      <PlusIcon className="h-6 md:ml-4" />
    </Button>
  );
}

export function CancelUpdateBtn() {
  return (
    <Link
      href="/admin/gallery"
      className="flex h-10 items-center rounded-lg bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
    >
      <span className="hidden md:block">Cancel</span>{" "}
      <XCircleIcon className="h-6 md:ml-4" />
    </Link>
  );
}

type SetAllImageVisibilityProps = {
  state: string;
  settings: any; // Replace 'any' with the actual type if known
  category_name: string;
};

export function SetAllImageVisibility({ state, settings, category_name }: SetAllImageVisibilityProps) {

  const makeAllImageVisibility = MakeAllImageVisibility.bind(null, settings, category_name);
  return (
    <form action={makeAllImageVisibility}>
      {state ==="enable"? 
      <button className="bg-blue-500 hover:bg-blue-400 text-xs text-white font-bold py-1 px-6 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              Visible      
      </button> :
      <button className="bg-gray-500 hover:bg-gray-400 text-xs  text-white font-bold py-1 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded">
               Not Visible
      </button>
      }
    </form>
  );
}

