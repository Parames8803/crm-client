import React, { useEffect, useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { MdDelete } from "react-icons/md";
import * as XLSX from "xlsx";
import {
  useAddFollowUserMutation,
  useDeleteFollowUserMutation,
  useGetFollowUserQuery,
} from "../redux/slices/api/followUserApiSlice";
import { toast } from "sonner";
import SendMessage from "../components/SendMessage";
import Button from "../components/Button";
import Loading from "../components/Loader";
import gmailSvg from "../assets/icongmail.svg";
import { dateFormatter, getInitials } from "../utils/index.js";
import Title from "../components/Title";

const BulkMessage = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [sendEmails, setEmails] = useState([]);

  const [followUsers] = useAddFollowUserMutation();
  const { users, isLoading, refetch } = useGetFollowUserQuery();
  const [deleteFollowUser] = useDeleteFollowUserMutation();

  const sendEmailHandler = (state) => {
    if (state === false) {
      window.location.reload();
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        let res = await followUsers(parsedData).unwrap();
        window.location.reload();
        toast.success(res.message);
      };
    }
  };

  const handleDeleteUser = async (user) => {
    await deleteFollowUser(user._id);
    refetch();
    window.location.reload();
    toast.success("Follow on user deleted");
  };

  const handleGmailService = async (user) => {
    setOpen(true);
    setEmails([user]);
  };

  const handleWhatsappService = async (user) => {};

  const fetchData = async () => {
    try {
      const result = await refetch();
      setEmails(result.data);
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-2">
      <>
        <div className="flex justify-between items-center">
          <Title title="Follow Users" className={"w-full"} />
          <div className="py-6 w-full">
            <form
              action=""
              method="post"
              onSubmit={handleFileSubmit}
              className="flex justify-end items-center"
            >
              <input
                type="file"
                name="xcel_file"
                onChange={handleFileChange}
                required
              />
              <Button
                icon={<FaCloudUploadAlt />}
                className={
                  "text-white bg-cyan-600 flex justify-center items-center gap-4"
                }
                type={"submit"}
                label={"Upload"}
              />
            </form>
          </div>
        </div>
        {data.length > 0 ? (
          <div className="p-5 bg-white shadow-md">
            <table className="bg-white w-full">
              <thead className="text-black-600 border-b bg-red-300">
                <tr>
                  <th className="py-3 text-md text-left px-8">Full Name</th>
                  <th className="py-3 text-md">Phone</th>
                  <th className="py-3 text-md">Email</th>
                  <th className="py-3 text-md">Date</th>
                  <th className="py-3 text-md text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="text-gray-600 text-md border-solid border-b-2 border-black-300"
                  >
                    <td className="py-4 px-8 text-left flex items-center gap-5">
                      <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
                        <span className="text-xs md:text-sm text-center">
                          {getInitials(item.name)}
                        </span>
                      </div>
                      {item.name}
                    </td>
                    <td className="py-3 px-5 text-center">{item.phone}</td>
                    <td className="py-3 px-5 text-center">{item.email}</td>
                    <td className="py-3 px-5 text-center">
                      {dateFormatter(item.createdAt)}
                    </td>
                    <td className="py-3 px-5 text-right flex justify-around items-center">
                      <img
                        src={gmailSvg}
                        alt="gmail"
                        className="text-red-500 cursor-pointer w-5"
                        onClick={() => {
                          handleGmailService(item);
                        }}
                      />
                      <MdDelete
                        className="text-red-600 text-xl hover:text-red-500 font-semibold sm:px-0"
                        type="button"
                        onClick={() => handleDeleteUser(item)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xl text-gray-700">No Follow ups Found</div>
        )}
        {data.length > 0 && (
          <div className="flex justify-end">
            <Button
              icon={<FaCloudUploadAlt />}
              className={
                "flex gap-5 items-center justify-between text-white bg-cyan-600 w-fit my-8"
              }
              type={"submit"}
              label={"Send Bulk Email"}
              onClick={() => {
                setOpen(true);
                setEmails(data);
              }}
            />
          </div>
        )}
      </>
      <SendMessage
        open={open}
        setOpen={setOpen}
        handler={sendEmailHandler}
        data={sendEmails}
      />
    </div>
  );
};

export default BulkMessage;
