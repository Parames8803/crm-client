import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { SiGmail } from "react-icons/si";
import gmailSvg from "../assets/icongmail.svg";
import Textbox from "./Textbox";
import TextArea from "./TextArea";
import Button from "./Button";
import { useSendMailServiceMutation } from "../redux/slices/api/followUserApiSlice";
import { toast } from "sonner";

const SendMessage = ({ open, setOpen, handler, data }) => {
  let defaultValues = {};
  const [emails, setEmails] = useState([]);
  const [sendEmailData] = useSendMailServiceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async (emailData) => {
    let onlyEmails = emails.map((val) => val.email);
    let res = await sendEmailData({ emailData, onlyEmails }).unwrap();
    toast.success(res.message);
    setOpen(false);
    reset();
  };

  const handleRemoveEmail = async (data) => {
    let res = emails.filter((val) => val.email !== data);
    setEmails(res);
  };

  useEffect(() => {
    let x = data.map(({ _id, email }) => ({
      _id,
      email,
    }));
    setEmails(x);
  }, [data]);

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Dialog.Title
              as="h2"
              className="text-2xl font-bold leading-6 text-gray-800 mb-4 flex justify-center items-center gap-5"
            >
              <img src={gmailSvg} alt="gmail" className="w-7" />
              <p>Send Gmail</p>
            </Dialog.Title>
            <div className=" flex flex-col gap-6">
              <Textbox
                placeholder="Subject"
                type="text"
                name="subject"
                label="Subject"
                className="w-full rounded"
                register={register("subject", {
                  required: "Subject is required!",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <TextArea
                label="Body"
                type="text"
                name="body"
                placeholder="Body"
                register={register("body", {
                  required: "Email Body is required",
                })}
                error={errors.description && errors.description.message}
                className="w-full rounded"
              />
              <div className="py-3 mt-4 sm:flex sm:flex-row items-center justify-end">
                <Button
                  type="button"
                  className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                  onClick={() => {
                    setOpen(false);
                    handler(false);
                  }}
                  label="Cancel"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                  label="Submit"
                />
              </div>
            </div>
          </form>
          <div className="font-bold text-lg">Selected Follow ups Users</div>
          {emails.length > 0 ? (
            <div className="my-5 flex flex-wrap">
              {emails.map((value, index) => (
                <div
                  key={index}
                  className="flex gap-x-2 border-2 w-fit px-2 py-1 rounded-xl border-gray-500 my-1 mr-2 cursor-pointer hover:text-white hover:bg-blue-500 hover:border-blue-500"
                  onClick={() => {
                    handleRemoveEmail(value.email);
                  }}
                >
                  <p className="text-xs">{value.email}</p>
                  <MdOutlineCancel className="text-red-700" />
                </div>
              ))}
            </div>
          ) : (
            <>No Follow ups selected...</>
          )}
        </div>
      </ModalWrapper>
    </>
  );
};

export default SendMessage;
