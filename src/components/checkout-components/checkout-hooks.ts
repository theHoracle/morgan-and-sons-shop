import { addDeliveryDetails, getUserInfo } from "@/app/(frontend)/checkout/action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetUser() {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: getUserInfo,
    })
}

export  function useUpdateInfo() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addDeliveryDetails,
        onMutate: async ({ newDeliveryDetail }) => {
            await queryClient.cancelQueries({ queryKey: ["current-user"] })

            const userDetail = queryClient.getQueryData<CurrentUserT>(["current-user"])
            if(userDetail) {
                queryClient.setQueryData(["current-user"], {
                ...userDetail,
                deliveryDetails: userDetail?.deliveryDetails?.push(newDeliveryDetail)
            })
            }
            return { userDetail }
        },
        onError: (err, variables, context) => {
            if (context?.userDetail) {
              queryClient.setQueryData(['cart'], context.userDetail);
            }
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
          },
    })
}

type CurrentUserT = {
    userId: number;
    deliveryDetails: {
        fullName?: string | null;
        phoneNumber?: string | null;
        address?: string | null;
        id?: string | null;
    }[] | null | undefined;
}