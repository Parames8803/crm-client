import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import { useForm } from "react-hook-form";
import SelectList from "./SelectList";
import Button from "./Button";
import { useGetProductsQuery } from "../redux/slices/api/productsApiSlice";
import Loading from "./Loader";
import { useCreateProposalMutation } from "../redux/slices/api/proposalApiSlice";
import { toast } from "sonner";

const AddProposal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { data: productList, isLoading, refetch } = useGetProductsQuery();
  const paymentTerms = ["UPI", "Debit Card", "Internet Banking"];
  const deliveryTerms = ["Door Delivery"];
  const [selectedProductsList, setSelectedProductsList] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState(paymentTerms[0]);
  const [delivery, setDelivery] = useState(deliveryTerms[0]);
  const [productNameList, setProductNameList] = useState();
  const [selectedProductName, setSelectedProductName] = useState();

  const [proposalData] = useCreateProposalMutation();

  useEffect(() => {
    if (productList) {
      const data = productList.map((item) => item.name);
      setProductNameList(data);
      setSelectedProductName(data[0]);
    }
  }, [productList]);

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      selectedProductsList,
      payment,
      delivery,
    };
    const res = await proposalData(formData).unwrap();
    if (res.status) {
      toast.success("Proposal created Success");
    }
  };

  const addProduct = () => {
    const updatedProducts = [...selectedProductsList];
    updatedProducts.push({
      name: selectedProductName,
      quantity,
    });
    setSelectedProductsList(updatedProducts);
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center pb-4">
        <div className="text-2xl font-bold text-gray-700">Add New Proposal</div>
        <Button
          label={"Back"}
          className={"bg-cyan-600 text-white px-5"}
          onClick={() => {
            window.history.back();
          }}
        />
      </div>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-between flex-col bg-white p-8 shadow-xl rounded-lg"
        >
          <div className="w-full border-solid border-b-2 border-black-300 mb-5">
            <h1 className="font-bold text-lg pb-5">Company Details</h1>
            <div className="flex justify-between gap-10 pb-10">
              <div className="w-full">
                <Textbox
                  placeholder="Company Name here"
                  type="text"
                  name="companyName"
                  label="Company Name"
                  className="rounded w-full"
                  register={register("companyName", {
                    required: "companyName is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
                <Textbox
                  placeholder="Customer Name here"
                  type="text"
                  name="customerName"
                  label="Customer Name"
                  className="rounded w-full"
                  register={register("customerName", {
                    required: "customerName is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
                <Textbox
                  placeholder="Phone Number here"
                  type="text"
                  name="phone"
                  label="Phone Number"
                  className="rounded w-full"
                  register={register("phone", {
                    required: "Phone is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
                <Textbox
                  placeholder="Address here"
                  type="text"
                  name="address"
                  label="Address"
                  className="rounded w-full"
                  register={register("address", {
                    required: "Address is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
              </div>
              <div className="w-full">
                <Textbox
                  placeholder="Email here"
                  type="text"
                  name="email"
                  label="Email"
                  className="rounded w-full"
                  register={register("email", {
                    required: "Email is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
                <Textbox
                  placeholder="City here"
                  type="text"
                  name="city"
                  label="City"
                  className="rounded w-full"
                  register={register("city", {
                    required: "City is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
                <Textbox
                  placeholder="State here"
                  type="text"
                  name="state"
                  label="State"
                  className="rounded w-full"
                  register={register("state", {
                    required: "State is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
                <Textbox
                  placeholder="Country here"
                  type="text"
                  name="country"
                  label="Country"
                  className="rounded w-full"
                  register={register("country", {
                    required: "Country is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-10 w-full">
            <div className="w-full">
              <h1 className="font-bold text-lg pb-5">Proposal Details</h1>
              <Textbox
                placeholder="Proposal Subject"
                type="text"
                name="proposalSubject"
                label="Proposal Subject"
                className="rounded w-full"
                register={register("proposalSubject", {
                  required: "proposalSubject is required!",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <div className="pt-5">
                <SelectList
                  label="Select Payment Mode"
                  lists={paymentTerms}
                  selected={payment}
                  setSelected={setPayment}
                />
              </div>
              <div className="pt-5">
                <SelectList
                  label="Select Delivery Term"
                  lists={deliveryTerms}
                  selected={delivery}
                  setSelected={setDelivery}
                />
              </div>
              <div className="w-full pt-5">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Valid Till"
                  className="w-full rounded"
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
              <div className="py-5">
                <Textbox
                  placeholder="Any Remarks"
                  type="text"
                  name="remarks"
                  label="Remarks"
                  className="w-full rounded"
                  register={register("remarks", {
                    required: "Remarks are required!",
                  })}
                  error={errors.remarks ? errors.remarks.message : ""}
                />
              </div>
              <div className="py-5">
                <Textbox
                  placeholder="Account Manager"
                  type="text"
                  name="accountManager"
                  label="Account Manager"
                  className="w-full rounded"
                  register={register("accountManager", {
                    required: "Account Manager are required!",
                  })}
                  error={errors.remarks ? errors.remarks.message : ""}
                />
              </div>
            </div>
            <div className="w-full">
              <h1 className="font-bold text-lg pb-5">Product Details</h1>
              {productNameList && productNameList.length > 0 && (
                <div>
                  <p>Add Products</p>
                  <div className="py-5">
                    <SelectList
                      label="Select Product"
                      lists={productNameList}
                      selected={selectedProductName}
                      setSelected={setSelectedProductName}
                    />
                  </div>
                  <div className="pb-5">
                    <label htmlFor="quantity" className="text-slate-800">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="w-full rounded bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300"
                      name="quantity"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      icon={<IoMdAdd />}
                      className={
                        "bg-gray-800 text-white flex flex-row-reverse items-center gap-2"
                      }
                      label={"Add Product"}
                      onClick={() => {
                        addProduct();
                      }}
                    />
                  </div>
                  <div>
                    {selectedProductsList.length > 0 && (
                      <ul className="mt-5 h-64 overflow-scroll">
                        {selectedProductsList.map((product, index) => (
                          <li
                            key={index}
                            className="w-full bg-gray-200 my-1 px-3 py-2 flex justify-between items-center"
                          >
                            <p>{product.name}</p>
                            <div className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center bg-gray-600">
                              {product.quantity}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              label={"Reset"}
              className={"text-xl"}
              onClick={() => {
                window.location.reload();
              }}
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 my-3 text-xl"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProposal;
