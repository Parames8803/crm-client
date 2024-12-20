import clsx from "clsx";
import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { tasks } from "../assets/data";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import AddUser from "../components/AddUser";
import ConfirmatioDialog from "../components/Dialogs";
import {
  useDeleteRestoreTasksMutation,
  useGetAllTaskQuery,
} from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loader";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "true",
    search: "",
  });

  const [deleteRestoreTask] = useDeleteRestoreTasksMutation();

  const deleteRestoreHandler = async () => {
    try {
      let result;
      switch (type) {
        case "delete":
          result = await deleteRestoreTask({
            id: selected,
            actionType: "delete",
          }).unwrap();
          break;
        case "deleteAll":
          result = await deleteRestoreTask({
            id: selected,
            actionType: "deleteAll",
          }).unwrap();
          break;
        case "restore":
          result = await deleteRestoreTask({
            id: selected,
            actionType: "restore",
          }).unwrap();
          break;
        case "restoreAll":
          result = await deleteRestoreTask({
            id: selected,
            actionType: "restoreAll",
          }).unwrap();
          break;
      }
      toast.success(result?.message);
      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };
  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permenantly delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left bg-red-300">
        <th className="py-3 text-left px-5">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="py-2">Modified On</th>
        <th className="py-3 text-right px-5 line-clamp-1">Action</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="px-5">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className="w-full line-clamp-2 text-base text-black">
            {item?.title}
          </p>
        </div>
      </td>

      <td className="py-2 capitalize">
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className="">{item?.priority}</span>
        </div>
      </td>

      <td className="py-2 capitalize text-center md:text-start">
        {item?.stage}
      </td>
      <td className="py-2 text-sm">{new Date(item?.date).toDateString()}</td>

      <td className="py-2 flex gap-1 justify-end">
        <Button
          icon={<MdOutlineRestore className="text-xl text-gray-500" />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className="text-xl text-red-600" />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 my-6">
        <div className="flex items-center justify-between mb-5">
          <Title title="Trashed Tasks" />

          <div className="flex gap-2 md:gap-4 items-center">
            <Button
              label="Restore All"
              icon={<MdOutlineRestore className="text-lg hidden md:flex" />}
              className="bg-cyan-600  text-white flex flex-row-reverse gap-1 items-center  text-black text-sm md:text-base 2xl:py-2.5"
              onClick={() => restoreAllClick()}
            />
            <Button
              label="Delete All"
              icon={<MdDelete className="text-lg hidden md:flex" />}
              className="bg-red-600 text-white flex flex-row-reverse gap-1 items-center  text-red-600 text-sm md:text-base 2xl:py-2.5"
              onClick={() => deleteAllClick()}
            />
          </div>
        </div>

        {data?.tasks?.length > 0 ? (
          <div className="bg-white shadow-md rounded">
            <div className="overflow-x-auto p-5 shadow-sm">
              <table className="w-full">
                <TableHeader />
                <tbody>
                  {data?.tasks?.map((tk, id) => (
                    <TableRow key={id} item={tk} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-xl text-gray-700">No Trash Found</div>
        )}
      </div>

      {/* <AddUser open={open} setOpen={setOpen} /> */}

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={() => deleteRestoreHandler()}
      />
    </>
  );
};

export default Trash;
