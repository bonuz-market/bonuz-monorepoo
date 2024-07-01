import { useMemo, useState } from "react";

import { Icon } from "@iconify/react";
import * as oauth from "oauth4webapi";
import { Controller, useForm } from "react-hook-form";

import { twitterRedirectUri } from "../../../config";
import clsxm from "../../lib/frontend/clsxm";
import { User, UserProfileData } from "../../types";
import Button from "../Button";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  tokenEndpoint: "https://twitter.com/i/oauth2/token",
  revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
};

const handleTwitterOAuth2 = async () => {
  const code_verifier = oauth.generateRandomCodeVerifier();
  // const code_verifier = '96eQXTy64XlpFRF8SqvXLUidfXsV9-xDJenBNoFC5UA'
  // console.log("code_verifier ", code_verifier);
  const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
  const code_challenge_method = "S256";

  localStorage.removeItem("code_verifier");
  localStorage.setItem("code_verifier", code_verifier);

  const authorizationUrl = new URL(discovery.authorizationEndpoint);
  authorizationUrl.searchParams.set(
    "client_id",
    "SzdVeGJ4dko4YjVvRFZrLWwzaGY6MTpjaQ"
  );
  authorizationUrl.searchParams.set("redirect_uri", twitterRedirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set(
    "scope",
    "tweet.read+users.read+offline.access"
  );
  authorizationUrl.searchParams.set("code_challenge", code_challenge);
  authorizationUrl.searchParams.set(
    "code_challenge_method",
    code_challenge_method
  );
  authorizationUrl.searchParams.set("state", "state");

  window.location.href = authorizationUrl.href;
};

const EditForm = ({
  onSave,
  onCancel,
  data,
  isLoading,
  userProfileData,
}: {
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  data: User;
  isLoading: boolean;
  userProfileData: any;
}) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { defaultValues },
  } = useForm<UserProfileData & { imageFile: File | null }>({
    defaultValues: useMemo(
      () => ({
        handle: data.handle ?? "",
        name: userProfileData?.name,
        profileImage: userProfileData?.profileImage,
        links: userProfileData?.links,
      }),
      [
        data.handle,
        userProfileData?.links,
        userProfileData?.name,
        userProfileData?.profileImage,
      ]
    ),
  });

  const onSubmit = handleSubmit(async (data) => {
    await onSave({
      ...data,
      imageFile,
    });
  });

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <div className="">
      <form onSubmit={onSubmit}>
        <div className="ms-auto mt-8 flex flex-col lg:flex-row w-full justify-end gap-4 lg:w-max">
          <Button
            transition
            className="w-full rounded-[10px] px-8 py-3"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            isLoading={isLoading}
            transition
            className="w-full rounded-[10px] px-8 py-3"
            type="submit"
          >
            Save
          </Button>
        </div>

        <div className="flex flex-col justify-around gap-4 lg:flex-row mt-10 max-h-[50vh] overflow-y-auto px-2">
          <div>
            <div className="flex items-start justify-center sm:flex-col sm:items-center sm:justify-start">
              <div className="shape-outer hexagon z-10 relative top-[0px]">
                <Controller
                  name="profileImage"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <div
                      className="shape-inner hexagon"
                      style={{
                        backgroundImage: `url(${image ?? value})`,
                      }}
                    >
                      <input
                        {...field}
                        type="file"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);

                            reader.onload = () => {
                              setImageFile(file);
                              setImage(reader.result as string);
                            };
                          }

                          onChange(e);
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col items-start justify-start space-y-2 mt-4">
              <label className="text-xl font-medium" htmlFor="name">
                Name
              </label>

              <input
                className="rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30"
                type="text"
                placeholder="Name"
                id="name"
                {...register("name", {
                  required: false,
                })}
              />

              <label className="text-xl font-medium" htmlFor="handle">
                Handle
              </label>

              <input
                className="rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30"
                type="text"
                placeholder="Handle"
                id="handle"
                {...register("handle", {
                  required: false,
                })}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-5">
            <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2">
              <h4 className="col-span-full">Social Media Accounts</h4>

              {defaultValues?.links?.socialMedias &&
                Object.entries(defaultValues?.links?.socialMedias).map(
                  ([key, value]) => {
                    const {
                      baseUrl,
                      icon,
                      imgSrc,
                      isVerified,
                      isTwitterVerified,
                    } = value as {
                      baseUrl: string;
                      link: string;
                      isPublic: boolean;
                      icon: any;
                      imgSrc: string;
                      isVerified: boolean;
                      isTwitterVerified: boolean;
                    };

                    const handleKey = `links.socialMedias.${key}.link` as any;
                    const isPublicKey =
                      `links.socialMedias.${key}.isPublic` as any;

                    const isPublic = watch(isPublicKey);
                    const isTwitter = key == "s_x";

                    return (
                      <div
                        className={clsxm(
                          "grid grid-cols-[max-content_1fr_max-content] items-center justify-items-start gap-x-4 rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30",
                          isTwitter &&
                            "grid-cols-[max-content_1fr_max-content_max-content] col-span-full pr-2"
                        )}
                        key={key}
                      >
                        <div className="flex items-center justify-center gap-4">
                          <img src={imgSrc} className="h-6 w-6" />

                          <span>{baseUrl}</span>
                        </div>

                        <input
                          className="rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/5 placeholder-slate-300"
                          type="text"
                          placeholder="Type Handle"
                          {...register(handleKey, {
                            required: false,
                          })}
                        />

                        <Icon
                          icon={`mdi:${isPublic ? "eye" : "eye-off"}`}
                          className={clsxm(
                            "h-6 w-6 cursor-pointer text-neutral-50 mr-2"
                          )}
                          onClick={() => {
                            const currentIsPublic = getValues(isPublicKey);
                            setValue(isPublicKey, !currentIsPublic);
                          }}
                        />

                        {isTwitter && (
                          <>
                            <Button
                              onClick={handleTwitterOAuth2}
                              className={clsxm(
                                isVerified && "cursor-not-allowed",
                                "rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30",
                                "text-white",
                                "border-none",
                                "hover:bg-white/10"
                              )}
                              disabled={isVerified}
                            >
                              {isVerified ? "Connected" : "Connect X"}

                              {isVerified && !isTwitterVerified && (
                                <Icon
                                  icon="lets-icons:check-fill"
                                  className={clsxm(
                                    "h-6 w-6 text-white",
                                    "cursor-not-allowed",
                                    "ml-auto"
                                  )}
                                />
                              )}
                              {isTwitter && isTwitterVerified && (
                                <Icon
                                  icon="bitcoin-icons:verify-filled"
                                  className={clsxm(
                                    "h-8 w-8 text-meta-5",
                                    "cursor-not-allowed",
                                    "ml-auto"
                                  )}
                                />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  }
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2 ">
              <h4 className="col-span-full">Blockchains & Wallets</h4>

              {defaultValues?.links?.blockchainsWallets &&
                Object.entries(defaultValues?.links?.blockchainsWallets).map(
                  ([key, value]) => {
                    const { baseUrl, icon, imgSrc, isVerified } = value as {
                      baseUrl: string;
                      link: string;
                      isPublic: boolean;
                      icon: any;
                      imgSrc: string;
                      isVerified: boolean;
                    };
                    const handleKey =
                      `links.blockchainsWallets.${key}.link` as any;

                    const isPublicKey =
                      `links.blockchainsWallets.${key}.isPublic` as any;

                    const isPublic = watch(isPublicKey);

                    return (
                      <div
                        className="grid grid-cols-[max-content_1fr_max-content] items-center justify-items-start gap-x-4 rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30"
                        key={key}
                      >
                        <div className="flex items-center justify-center gap-4">
                          <img src={imgSrc} className="h-6 w-6" />

                          <span>{baseUrl}</span>
                        </div>

                        <input
                          className="rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/5 placeholder-slate-300"
                          type="text"
                          placeholder="Handle"
                          {...register(handleKey, {
                            required: false,
                          })}
                        />

                        <Icon
                          icon={`mdi:${isPublic ? "eye" : "eye-off"}`}
                          className={clsxm(
                            "h-6 w-6 cursor-pointer text-neutral-50 mr-2"
                          )}
                          onClick={() => {
                            const currentIsPublic = getValues(isPublicKey);
                            setValue(isPublicKey, !currentIsPublic);
                          }}
                        />
                      </div>
                    );
                  }
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2 ">
              <h4 className="col-span-full">Messaging Apps</h4>

              {defaultValues?.links?.messengers &&
                Object.entries(defaultValues?.links?.messengers).map(
                  ([key, value]) => {
                    const { baseUrl, icon, imgSrc, isVerified } = value as {
                      baseUrl: string;
                      link: string;
                      isPublic: boolean;
                      icon: any;
                      imgSrc: string;
                      isVerified: boolean;
                    };
                    const handleKey = `links.messengers.${key}.link` as any;

                    const isPublicKey =
                      `links.messengers.${key}.isPublic` as any;

                    const isPublic = watch(isPublicKey);

                    return (
                      <div
                        className="grid grid-cols-[max-content_1fr_max-content] items-center justify-items-start gap-x-4 rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30"
                        key={key}
                      >
                        <div className="flex items-center justify-center gap-4">
                          <img src={imgSrc} className="h-6 w-6" />

                          <span>{baseUrl}</span>
                        </div>

                        <input
                          className="rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/5 placeholder-slate-300"
                          type="text"
                          placeholder="Handle"
                          {...register(handleKey, {
                            required: false,
                          })}
                        />

                        <Icon
                          icon={`mdi:${isPublic ? "eye" : "eye-off"}`}
                          className={clsxm(
                            "h-6 w-6 cursor-pointer text-neutral-50 mr-2"
                          )}
                          onClick={() => {
                            const currentIsPublic = getValues(isPublicKey);
                            setValue(isPublicKey, !currentIsPublic);
                          }}
                        />
                      </div>
                    );
                  }
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2 ">
              <h4 className="col-span-full">Digital Identifiers</h4>

              {defaultValues?.links?.digitalIdentifiers &&
                Object.entries(defaultValues?.links?.digitalIdentifiers).map(
                  ([key, value]) => {
                    const { baseUrl, icon, imgSrc, isVerified } = value as {
                      baseUrl: string;
                      link: string;
                      isPublic: boolean;
                      icon: any;
                      imgSrc: string;
                      isVerified: boolean;
                    };
                    const handleKey =
                      `links.digitalIdentifiers.${key}.link` as any;
                    const isPublicKey =
                      `links.digitalIdentifiers.${key}.isPublic` as any;

                    const isPublic = watch(isPublicKey);

                    return (
                      <div
                        className="grid grid-cols-[max-content_1fr_max-content] items-center justify-items-start gap-x-4 rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30"
                        key={key}
                      >
                        <div className="flex items-center justify-center gap-4">
                          <img src={imgSrc} className="h-6 w-6" />

                          <span>{baseUrl}</span>
                        </div>

                        <input
                          className="rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/5 placeholder-slate-300"
                          type="text"
                          placeholder="Handle"
                          {...register(handleKey, {
                            required: false,
                          })}
                        />

                        <Icon
                          icon={`mdi:${isPublic ? "eye" : "eye-off"}`}
                          className={clsxm(
                            "h-6 w-6 cursor-pointer text-neutral-50 mr-2"
                          )}
                          onClick={() => {
                            const currentIsPublic = getValues(isPublicKey);
                            setValue(isPublicKey, !currentIsPublic);
                          }}
                        />
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
